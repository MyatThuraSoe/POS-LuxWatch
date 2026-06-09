<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class SubmitClaimRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('claim', \App\Models\Warranty::class);
    }

    public function rules(): array
    {
        return [
            'reason' => 'required|string|max:500',
            'customer_description' => 'nullable|string|max:1000',
        ];
    }
}
