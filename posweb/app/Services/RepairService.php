<?php

namespace App\Services;

use App\Models\RepairJob;

class RepairService
{
    public function updateStatus(RepairJob $job, string $status, ?string $diagnosis = null, ?float $cost = null): RepairJob
    {
        $data = ['status' => $status];

        if ($diagnosis !== null) {
            $data['diagnosis'] = $diagnosis;
        }

        if ($cost !== null) {
            $data['repair_cost'] = $cost;
        }

        if ($status === 'ready' || $status === 'completed') {
            $data['estimated_completion'] = now();
        }

        $job->update($data);

        return $job->fresh();
    }

    public function getOverdueJobs()
    {
        return RepairJob::where('status', '!=', 'completed')
            ->where('status', '!=', 'cancelled')
            ->where('created_at', '<', now()->subDays(RepairJob::SLA_DAYS))
            ->with(['claim.warranty.serial.variant.product', 'technician'])
            ->orderBy('created_at')
            ->get();
    }

    public function getByTechnician(int $technicianId, ?string $status = null)
    {
        $query = RepairJob::where('technician_id', $technicianId);

        if ($status) {
            $query->where('status', $status);
        }

        return $query->with(['claim.warranty', 'serial.variant'])
            ->orderByDesc('updated_at')
            ->paginate(20);
    }

    public function getStats(): array
    {
        $total = RepairJob::count();
        $completed = RepairJob::where('status', 'completed')->count();
        $inProgress = RepairJob::whereIn('status', ['received', 'diagnosing', 'repairing'])->count();
        $ready = RepairJob::where('status', 'ready')->count();
        $overdue = $this->getOverdueJobs()->count();

        $avgCompletionDays = RepairJob::where('status', 'completed')
            ->selectRaw('AVG(DATEDIFF(updated_at, created_at)) as avg_days')
            ->value('avg_days') ?? 0;

        return [
            'total' => $total,
            'completed' => $completed,
            'in_progress' => $inProgress,
            'ready_for_pickup' => $ready,
            'overdue' => $overdue,
            'avg_completion_days' => round($avgCompletionDays, 1),
        ];
    }
}
