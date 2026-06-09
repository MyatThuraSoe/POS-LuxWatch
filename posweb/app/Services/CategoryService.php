<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\CategoryRepository;
use Illuminate\Support\Facades\DB;

class CategoryService extends BaseService
{
    public function __construct(protected CategoryRepository $repository) {}

    public function getAll(array $filters = [])
    {
        return $this->repository->getWithCounts($filters);
    }

    public function getTree()
    {
        return $this->repository->getTree();
    }

    public function create(array $data): Category
    {
        return DB::transaction(function () use ($data) {
            $category = $this->repository->create($data);
            $this->audit('created', $category, 'category');
            return $category;
        });
    }

    public function update(int $id, array $data): Category
    {
        return DB::transaction(function () use ($id, $data) {
            $category = $this->repository->update($id, $data);
            $this->audit('updated', $category, 'category');
            return $category;
        });
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $category = $this->repository->find($id);
            $this->repository->delete($id);
            $this->audit('deleted', $category, 'category');
        });
    }
}
