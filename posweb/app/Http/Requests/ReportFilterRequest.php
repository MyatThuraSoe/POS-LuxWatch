<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Carbon\Carbon;

class ReportFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Auth handled by middleware/policy
    }

    public function rules(): array
    {
        return [
            'start_date' => ['nullable', 'date', 'before_or_equal:end_date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'cashier_id' => ['nullable', 'exists:users,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'brand_id' => ['nullable', 'exists:brands,id'],
            'employee_id' => ['nullable', 'exists:users,id'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Max date range 365 days
            if ($this->filled('start_date') && $this->filled('end_date')) {
                $start = Carbon::parse($this->start_date);
                $end = Carbon::parse($this->end_date);
                
                if ($end->diffInDays($start) > 365) {
                    $validator->errors()->add('date_range', 'Date range cannot exceed 365 days.');
                }
            }
        });
    }
}
