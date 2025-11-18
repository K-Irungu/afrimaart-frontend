<!-- components/RevenueChart.vue -->
<template>
  <div class="chart-wrapper">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js';

export default {
  name: 'RevenueChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    Chart.register(...registerables);
    this.renderChart();
  },
  watch: {
    chartData: {
      handler() {
        if (this.chart) {
          this.chart.data = this.chartData;
          this.chart.update('none');
        }
      },
      deep: true
    },
    chartOptions: {
      handler() {
        if (this.chart) {
          Object.assign(this.chart.options, this.chartOptions);
          this.chart.update('none');
        }
      },
      deep: true
    }
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.chartCanvas.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: this.chartData,
        options: {
          ...this.chartOptions,
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>