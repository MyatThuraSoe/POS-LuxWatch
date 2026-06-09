<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('DROP VIEW IF EXISTS mv_daily_sales');
        DB::statement('DROP VIEW IF EXISTS mv_inventory_valuation');

        if (Schema::hasTable('sales')) {
            DB::statement("
                CREATE VIEW mv_daily_sales AS
                SELECT
                    DATE(created_at)       AS date,
                    COUNT(*)               AS total_sales,
                    SUM(total_amount)      AS total_revenue,
                    SUM(tax_amount)        AS total_tax,
                    SUM(discount_amount)   AS total_discount,
                    COUNT(DISTINCT id)     AS transaction_count
                FROM sales
                WHERE status IN ('completed', 'refunded', 'partially_refunded')
                GROUP BY DATE(created_at)
            ");
        }

        if (Schema::hasTable('product_variants') && Schema::hasTable('inventory_items')) {
            DB::statement("
                CREATE VIEW mv_inventory_valuation AS
                SELECT
                    pv.id                            AS variant_id,
                    pv.sku,
                    ii.quantity,
                    pv.cost_price,
                    pv.retail_price,
                    (ii.quantity * pv.cost_price)    AS total_cost_value,
                    (ii.quantity * pv.retail_price)  AS total_retail_value
                FROM product_variants pv
                JOIN inventory_items ii ON pv.id = ii.variant_id
                WHERE ii.quantity > 0
            ");
        }
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS mv_daily_sales');
        DB::statement('DROP VIEW IF EXISTS mv_inventory_valuation');
    }
};