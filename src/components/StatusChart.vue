<template>
  <div>
    <canvas ref="statusChart"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  data() {
    return {
      chart: null,
    };
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  created() {
    if (this.chartData) {
      this.renderChart();
    }
  },
  methods: {
    renderChart() {
      console.log("enter");
      if (this.chart) {
        this.chart.destroy();
      }
      const ctx = this.$refs.statusChart;
      this.chart = new Chart(ctx, {
        type: "pie",
        data: this.chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom", // Change the position of the legend (e.g., bottom, top, left, right)
            },
            title: {
              display: true,
              text: "Employment Status",
            },
          },
          breakpoints: {
            // Define responsive breakpoints here
            480: {
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: "bottom",
                },
              },
            },
          },
        },
      });
    },
    destroy() {
      if (this.chart) {
        this.chart.destroy();
      }
    },
  },

  beforeUnmount() {
    this.destroy();
  },
  watch: {
    chartData: {
      handler: "renderChart",
      deep: true,
    },
  },
};
</script>
