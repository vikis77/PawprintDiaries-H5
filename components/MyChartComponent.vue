<!-- <template>
  <div class="charts-box">
    <qiun-vue-ucharts 
      type="line"
      :opts="opts"
      :chartData="chartData"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import qiunVueUcharts from '@qiun/vue-ucharts';

export default defineComponent({
  components: {
    qiunVueUcharts
  },
  setup() {
    const chartData = ref({});
    const opts = ref({
      color: ["#1890FF","#91CB74","#FAC858","#EE6666","#73C0DE","#3CA272","#FC8452","#9A60B4","#ea7ccc"],
      padding: [15,10,0,15],
      enableScroll: false,
      legend: {},
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        gridType: "dash",
        dashLength: 2
      },
      extra: {
        line: {
          type: "straight",
          width: 2,
          activeType: "hollow"
        }
      }
    });

    const getServerData = () => {
      // 模拟从服务器获取数据时的延时
      setTimeout(() => {
        // 模拟服务器返回数据
        const res = {
          categories: ["2018","2019","2020","2021","2022","2023"],
          series: [
            {
              name: "成交量A",
              data: [35,8,25,37,4,20]
            },
            {
              name: "成交量B",
              data: [70,40,65,100,44,68]
            },
            {
              name: "成交量C",
              data: [100,80,95,150,112,132]
            }
          ]
        };
        chartData.value = JSON.parse(JSON.stringify(res));
      }, 500);
    };

    onMounted(() => {
      getServerData();
    });

    return {
      chartData,
      opts
    };
  }
});
</script>

<style scoped>
  /* 请根据实际需求修改父元素尺寸，组件自动识别宽高 */
  .charts-box {
    width: 500px;
    height: 300px;
  }
</style> -->
