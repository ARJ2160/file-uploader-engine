export interface ExcelProcessingJob {
  fileKey: string;
  fileName: string;
  processingOptions: ProcessingOptions;
}

export interface ProcessingOptions {
  skipRows?: number;
  columnMapping?: Record<string, string>;
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  column: string;
  rule: string;
  errorMessage: string;
}

export interface ProcessingResult {
  success: boolean;
  processedRows: number;
  errors?: ProcessingError[];
  products: Product[];
}

export interface ProcessingError {
  row: number;
  column: string;
  message: string;
}

export interface ProductData {
  productName: string;
  sales?: number;
  properties: Record<string, any>;
  sourceFiles: string[];
}

export interface AggregatedData {
  products: Record<string, ProductData>;
  lastUpdated: Date;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  createdAt: Date;
}

export interface ProductSummary {
  totalProducts: number;
  totalValue: number;
  categorySummary: Record<string, number>;
}
