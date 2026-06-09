<?php

namespace App\Http\Requests\Receipt;

use Illuminate\Foundation\Http\FormRequest;

class StorePrintRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('print', \App\Models\Sale::class);
    }

    public function rules(): array
    {
        return [
            'terminal_id' => 'required|string|max:50',
            'action' => 'required|in:initial,reprint',
            'reason' => 'nullable|string|max:255|required_if:action,reprint',
        ];
    }

    public function messages(): array
    {
        return [
            'reason.required_if' => 'A reason is required for reprint actions.',
        ];
    }
}
