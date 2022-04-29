import { NumberSymbol } from "@angular/common";

export class Product {
    id?: number;
    ean13?: number;
    description?: string;
}

export class InventoryLine {
    lineId?: number;
    inventory?: number;
    product?: number;
    expected_quantity?: number;
    quantity?: number;
}

