<?php

namespace App\Http\Requests\Receipt;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manageTemplates', \App\Models\ReceiptTemplate::class);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:100',
            'header_html' => 'nullable|string|max:5000',
            'footer_html' => 'nullable|string|max:5000',
            'warranty_text' => 'nullable|string|max:2000',
            'is_active' => 'boolean',
        ];
    }
}
