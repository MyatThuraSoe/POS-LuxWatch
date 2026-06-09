<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warranties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->onDelete('cascade');
            $table->foreignId('serial_id')->constrained('serial_numbers')->onDelete('cascade');
            $table->foreignId('customer_id')->nullable()->constrained()->onDelete('set null');
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['active', 'expired', 'void', 'claimed'])->default('active');
            $table->text('terms')->nullable();
            $table->timestamps();

            $table->index(['serial_id', 'status']);
            $table->index('end_date');
        });

        Schema::create('warranty_claims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('warranty_id')->constrained()->onDelete('cascade');
            $table->string('claim_number')->unique();
            $table->text('reason');
            $table->text('customer_description')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('submitted_by')->constrained('users');
            $table->timestamp('submitted_at');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();

            $table->index(['warranty_id', 'status']);
        });

        Schema::create('repair_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('claim_id')->constrained('warranty_claims')->onDelete('cascade');
            $table->foreignId('serial_id')->constrained('serial_numbers');
            $table->enum('status', ['received', 'diagnosing', 'repairing', 'ready', 'completed', 'cancelled'])->default('received');
            $table->text('diagnosis')->nullable();
            $table->decimal('repair_cost', 10, 2)->default(0);
            $table->foreignId('technician_id')->nullable()->constrained('users');
            $table->timestamp('estimated_completion')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index('technician_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_jobs');
        Schema::dropIfExists('warranty_claims');
        Schema::dropIfExists('warranties');
    }
};