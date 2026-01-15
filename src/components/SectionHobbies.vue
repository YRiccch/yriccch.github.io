<template>
  <section id="hobbies" class="section-container">
    <h2 class="section-title">🌟 Hobbies</h2>
    
    <div class="hobbies-content">
      <div class="chart-wrapper">
        <div ref="chartRef" class="echart-container"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import basketballIcon from '@/assets/img/Basketball.svg'
import singingIcon from '@/assets/img/Singing.svg'
import guitarIcon from '@/assets/img/Guitar.svg'
import travelIcon from '@/assets/img/Travel.svg'

const chartRef = ref(null)
let myChart = null

const initChart = () => {
  if (!chartRef.value) return
  
  myChart = echarts.init(chartRef.value)
  
  const option = {
    color: ['#FF917C', '#5B8FF9'],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['Degree of Love', 'Degree of Skill'],
      right: 0,
      top: 0,
      orient: 'vertical',
      textStyle: {
        color: 'var(--text-secondary)'
      }
    },
    radar: {
      indicator: [
        { name: 'Basketball', max: 100 },
        { name: 'Singing', max: 100 },
        { name: 'Guitar', max: 100 },
        { name: 'Travel', max: 100 }
      ],
      center: ['50%', '50%'],
      radius: '65%',
      splitNumber: 4,
      shape: 'circle',
      axisName: {
        formatter: function (value) {
          return '{' + value + '|}\n{value}';
        },
        rich: {
          Basketball: {
            height: 40,
            width: 40,
            align: 'center',
            backgroundColor: {
              image: basketballIcon
            },
            marginBottom: 5 // Add spacing between icon and text
          },
          Singing: {
            height: 40,
            width: 40,
            align: 'center',
            backgroundColor: {
              image: singingIcon
            },
            marginBottom: 5
          },
          Guitar: {
            height: 40,
            width: 40,
            align: 'center',
            backgroundColor: {
              image: guitarIcon
            },
            marginBottom: 5
          },
          Travel: {
            height: 40,
            width: 40,
            align: 'center',
            backgroundColor: {
              image: travelIcon
            },
            marginBottom: 5
          }
        },
        color: 'var(--text-secondary)',
        fontSize: 14,
        fontWeight: 'bold',
        padding: [0, 5],
        lineHeight: 20 // Adjust line height to accommodate text below icon
      },
      splitArea: {
        areaStyle: {
          color: ['transparent'],
          shadowColor: 'rgba(0, 0, 0, 0)',
          shadowBlur: 0
        }
      },
      axisLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#E5E7EB'
        }
      }
    },
    series: [
      {
        name: 'Hobbies Analysis',
        type: 'radar',
        emphasis: {
          lineStyle: {
            width: 4
          }
        },
        data: [
          {
            value: [95, 95, 85, 98],
            name: 'Degree of Love',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(255, 145, 124, 0.4)' },
                { offset: 1, color: 'rgba(255, 145, 124, 0.1)' }
              ])
            },
            lineStyle: {
              width: 2
            }
          },
          {
            value: [80, 85, 60, 90],
            name: 'Degree of Skill',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(91, 143, 249, 0.4)' },
                { offset: 1, color: 'rgba(91, 143, 249, 0.1)' }
              ])
            },
            lineStyle: {
              width: 2
            }
          }
        ]
      }
    ]
  }
  
  myChart.setOption(option)
}

const handleResize = () => {
  myChart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  myChart?.dispose()
})
</script>

<style scoped lang="scss">
.section-container {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.hobbies-content {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  padding: 0rem;
}

.chart-wrapper {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  margin: 0 auto;
}

.echart-container {
  width: 100%;
  height: 100%;
}
</style>