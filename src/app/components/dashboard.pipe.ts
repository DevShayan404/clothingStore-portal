import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
})
export class DashboardPipe implements PipeTransform {
  transform(items: readonly any[] | undefined, searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items ? [...items] : [];
    }

    searchTerm = searchTerm.toLowerCase();

    return (items as any[]).filter((item) => {
      return (
        item.categoryName.toLowerCase().includes(searchTerm) ||
        item.categoryItemName.toLowerCase().includes(searchTerm)
      );
      // Add other properties to search if needed
      // item.otherProperty.toLowerCase().includes(searchTerm) ||
      // ...
    });
  }
}
