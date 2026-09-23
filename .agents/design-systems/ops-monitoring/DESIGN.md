# Operations Monitoring Design System Extension (`DESIGN.md`)

> **Extends**: `company/DESIGN.md`  
> **Target Domain**: Real-time telemetry, infrastructure monitoring, log aggregation, alerting dashboards, IoT/device management.

## 1. Domain Principles
* **Signal Over Noise**: High-priority alert severity triggers instant visual signals (pulsing indicators, high-contrast dark theme option).
* **Real-Time Trust**: Live status indicators (Online/Offline/Degraded) with explicit timestamp update counters.
* **Time-Series Clarity**: Standardized chart axes, stream controls, and metric thresholds.

## 2. Token & Component Overrides
* Supported Canvas: Dark mode surface option (`--color-bg-canvas: #0f172a`, `--color-bg-surface: #1e293b`).
* Alert severity tokens: Critical (`#ef4444`), Warning (`#f59e0b`), Info (`#3b82f6`), Healthy (`#10b981`).
