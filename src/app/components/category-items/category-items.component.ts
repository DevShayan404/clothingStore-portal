import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoryItemsService } from './category-items.service';

@Component({
  selector: 'app-category-items',
  templateUrl: './category-items.component.html',
  styleUrls: ['./category-items.component.css'],
})
export class CategoryItemsComponent implements OnInit {
  selectedValue: any;

  searchTerm: string = '';
  editCache: { [key: number]: { edit: boolean; data: any } } = {};
  listOfData: any[] = [];
  image: boolean = false;
  loading: boolean = true;
  fileList: NzUploadFile[] = [];
  // base64String!: string | undefined;
  fileUploadedSpinner: boolean = false;
  // categoryName!: string;
  checked: boolean = false;
  indeterminate: boolean = false;
  isVisible: boolean = false;
  isOkLoading: boolean = false;
  validateForm!: FormGroup;
  listOfCategory: any[] = [];
  constructor(
    private service: CategoryItemsService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private nzMessageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.generateData();
    this.dropdownList();
    this.validateForm = this.fb.group({
      categoryItemName: [null, [Validators.required]],
      fileUpload: [null, [Validators.required]],
      categoryName: [null, [Validators.required]],
    });
  }

  cancelImage(image: boolean): void {
    this.image = image;
  }

  startEdit(id: number): void {
    this.editCache[id].edit = true;
    this.image = true;
    this.isVisible = false;
  }

  cancelEdit(id: number): void {
    const index = this.listOfData.findIndex((item) => item.categoryId === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false,
    };
  }

  saveEdit(id: number): void {
    this.validateForm.get('fileUpload')?.markAsTouched();
    if (this.validateForm.valid) {
      const index = this.listOfData.findIndex((item) => item.categoryId === id);
      Object.assign(this.listOfData[index], this.editCache[id].data);
      const obj = {
        categoryName: this.validateForm.value.categoryName,
        src: this.validateForm.value.fileUpload,
        vendorId: 0,
      };
      this.service.editCategory(id, obj).subscribe((res) => {
        this.generateData();
        this.nzMessageService.success(res.message);
        this.editCache[id].edit = false;
      });
    }
  }

  updateEditCache(): void {
    this.listOfData.forEach((item) => {
      this.editCache[item.categoryId] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  generateData() {
    this.service.getAllCategories().subscribe((res) => {
      const categories = res;
      this.listOfData = categories!;
      this.updateEditCache();
      this.loading = false;
    });
  }
  dropdownList() {
    this.service.getDropdownList().subscribe((res) => {
      this.listOfCategory = res!;
    });
  }

  onAllChecked(value: boolean): void {}

  //Add Product -----------------------

  showAddProduct(): void {
    this.isVisible = !this.isVisible;
    this.validateForm.reset();
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileUploadedSpinner = true;
    if (file.size !== undefined) {
      const fileSizeInMB = file.size / (1024 * 1024); // Convert size to MB

      // Clear previous images when a new image is uploaded
      this.fileList = [];

      if (fileSizeInMB > 3) {
        // Convert NzUploadFile to File
        const nativeFile = file as any;

        // Resize the image to 1MB before converting to base64
        this.resizeImage(nativeFile, 1, (resizedFile: File) => {
          this.fileList.push(resizedFile as any); // Cast to NzUploadFile if necessary
          this.convertIntoBase64();
          this.fileUploadedSpinner = false;
        });
      } else {
        this.fileList.push(file);
        this.convertIntoBase64();
        this.fileUploadedSpinner = false;
      }
    } else {
      console.error('File size is undefined.');
    }

    return false;
  };

  convertIntoBase64() {
    if (this.fileList.length > 0) {
      const file = this.fileList[0];
      const blobFile: Blob | File = file as any;

      const reader = new FileReader();

      reader.onload = (event: any) => {
        const base64String = event.target.result;
        this.cdr.detectChanges(); // Manually trigger change detection

        this.validateForm.patchValue({
          fileUpload: base64String,
        });
      };

      reader.readAsDataURL(blobFile);
    } else {
      console.log('No file selected.');
    }
  }

  resizeImage(
    file: File,
    targetSizeInMB: number,
    callback: (resizedFile: File) => void
  ): void {
    const reader = new FileReader();

    reader.onload = (event: any) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const maxWidth = 1024; // Adjust as needed
        const maxHeight = 1024; // Adjust as needed

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const resizedFile = new File([blob!], file.name, {
            type: 'image/jpeg',
          });
          callback(resizedFile);
        }, 'image/jpeg');
      };
    };

    reader.readAsDataURL(file);
  }

  deleteImg() {
    this.fileList = [];
  }

  addData() {
    this.validateForm.get('fileUpload')?.markAsTouched();

    if (this.validateForm.valid) {
      const obj = {
        categoryItemName: this.validateForm.value.categoryItemName,
        src: this.validateForm.value.fileUpload,
        categoryId: this.validateForm.value.categoryName,
      };
      this.service.postCategory(obj).subscribe((res) => {
        this.generateData();
        this.nzMessageService.success(res.message);
        this.isVisible = false;
        // this.categoryName = '';
        // this.base64String = undefined;
        this.validateForm.reset();
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  deleteCategory(id: number) {
    this.service.deleteCategory(id).subscribe((res) => {
      this.generateData();
      this.nzMessageService.info(res.message);
    });
  }

  cancel(): void {
    this.nzMessageService.info('click cancel');
  }
}
