<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRepairStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manageRepairs', \App\Models\RepairJob::class);
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:received,diagnosing,repairing,ready,completed,cancelled',
            'diagnosis' => 'nullable|string|max:2000',
            'repair_cost' => 'nullable|numeric|min:0|max:999999.99',
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'Invalid repair status. Must be one of: received, diagnosing, repairing, ready, completed, cancelled.',
        ];
    }
}
