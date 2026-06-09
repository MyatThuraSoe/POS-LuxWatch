<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Phase 8: Receipts & Vouchers
        Schema::create('receipt_templates', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('header_html')->nullable();
            $table->text('footer_html')->nullable();
            $table->text('warranty_text')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->onDelete('cascade');
            $table->foreignId('template_id')->nullable()->constrained('receipt_templates');
            $table->string('template_version')->default('1.0');
            $table->text('qr_payload')->nullable();
            $table->timestamp('printed_at')->nullable();
            $table->timestamps();
            
            $table->unique('sale_id');
        });

        Schema::create('print_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receipt_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained();
            $table->string('terminal_id');
            $table->enum('action', ['initial', 'reprint']);
            $table->string('reason')->nullable();
            $table->enum('status', ['success', 'failed'])->default('success');
            $table->timestamp('printed_at')->useCurrent();
            $table->timestamps();
            
            $table->index(['user_id', 'action']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('print_logs');
        Schema::dropIfExists('receipts');
        Schema::dropIfExists('receipt_templates');
    }
};
