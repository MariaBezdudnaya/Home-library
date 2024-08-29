// Определение типов
export type BookCategory = 'Художественная литература' | 'Научная литература' | 'Детская литература' | 'Бизнес-литература';

// Определение списка категорий
export const bookCategories: BookCategory[] = [
    'Художественная литература',
    'Научная литература',
    'Детская литература',
    'Бизнес-литература',
];

export interface IBook {
  id: number;
  title: string;
  author: string;
  category: BookCategory;
}