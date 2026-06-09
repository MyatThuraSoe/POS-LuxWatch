<?php

namespace App\Interfaces;

interface RepositoryInterface
{
    /**
     * Get all records.
     */
    public function all(array $columns = ['*']);

    /**
     * Find a record by id.
     */
    public function find(int $id, array $columns = ['*']);

    /**
     * Find a record by a specific field.
     */
    public function findBy(string $field, mixed $value, array $columns = ['*']);

    /**
     * Create a new record.
     */
    public function create(array $data);

    /**
     * Update an existing record.
     */
    public function update(int $id, array $data);

    /**
     * Delete a record.
     */
    public function delete(int $id): bool;

    /**
     * Paginate records.
     */
    public function paginate(int $perPage = 15, array $columns = ['*']);
}
