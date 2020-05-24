import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { DashDTO } from 'src/models/dto/dashDTO.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {
  today: Date = new Date();
  dash: DashDTO;
  options: {
    products: EChartOption,
    orders: EChartOption,
    activity: EChartOption
  } = {
    products: undefined,
    orders: undefined,
    activity: undefined
  };

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.dash = this.route.snapshot.data.dash;
    this.options.products = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        bottom: 5,
        data: ['Goods', 'Services']
      },
      series: [
        {
          name: 'Products',
          type: 'pie',
          center: ['50%', '40%'],
          radius: ['40%', '90%'],
          roseType: 'radius',
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 24,
              fontWeight: 'bold'
            }
          },
          data: [
            { value: this.dash.Charts.Products.Goods, name: 'Goods' },
            { value: this.dash.Charts.Products.Services, name: 'Services' },
          ]
        }
      ]
    };

    this.options.orders = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        bottom: 5,
        data: ['New', 'Completed', 'Cancelled']
      },
      series: [
        {
          name: 'Orders',
          type: 'pie',
          center: ['50%', '40%'],
          radius: ['40%', '90%'],
          roseType: 'radius',
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 24,
              fontWeight: 'bold'
            }
          },
          data: [
            { value: this.dash.Charts.Orders.New, name: 'New' },
            { value: this.dash.Charts.Orders.Completed, name: 'Completed' },
            { value: this.dash.Charts.Orders.Cancelled, name: 'Cancelled' }
          ]
        }
      ]
    };

    this.options.activity = {
      tooltip: {
        trigger: 'item',
        formatter: function  (params: any, ticket, callback) {
          const number = Number.parseInt(params.data[2]);
          const unit = number === 1 ? params.seriesName.slice(0, -1) : params.seriesName;
          const date = params.name;
          return `${date}:</br>${number} ${unit}`;
        }
      },
      grid: {
        top: 5,
        right: 5,
        bottom: 30,
        left: 115
      },
      xAxis: {
        type: 'category',
        data: this.getLast10Days(),
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: ['New Users', 'New Products', 'New Orders', 'Completed Orders', 'Cancelled Orders'].reverse(),
        splitArea: {
          show: true
        }
      },
      visualMap: [
        {
          type: 'continuous',
          min: 1,
          max: Math.max(...this.dash.Charts.Activity.NewUsers),
          seriesIndex: 0,
          inRange: {
            color: ['#F6AEAC', '#C23531']
          },
          show: false
        },
        {
          type: 'continuous',
          min: 1,
          max: Math.max(...this.dash.Charts.Activity.NewProducts),
          seriesIndex: 1,
          inRange: {
            color: ['#8E9EAA', '#2F4554']
          },
          show: false
        },
        {
          type: 'continuous',
          min: 1,
          max: Math.max(
            ...this.dash.Charts.Activity.NewOrders,
            ...this.dash.Charts.Activity.CompletedOrders,
            ...this.dash.Charts.Activity.CancelledOrders
          ),
          seriesIndex: [2, 3, 4],
          inRange: {
            color: ['#BADCE0', '#61A0A8']
          },
          show: false
        }
      ],
      series: [
        {
          name: 'Users',
          type: 'heatmap',
          data: [
            ...this.dash.Charts.Activity.NewUsers.map((value, key) => [key, 4, value]).filter((item) => item[2] !== 0)
          ],
          label: {
            show: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        {
          name: 'Products',
          type: 'heatmap',
          data: [
            ...this.dash.Charts.Activity.NewProducts.map((value, key) => [key, 3, value]).filter((item) => item[2] !== 0)
          ],
          label: {
            show: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        {
          name: 'Orders',
          type: 'heatmap',
          data: [
            ...this.dash.Charts.Activity.NewOrders.map((value, key) => [key, 2, value]).filter((item) => item[2] !== 0),
            ...this.dash.Charts.Activity.CompletedOrders.map((value, key) => [key, 1, value]).filter((item) => item[2] !== 0),
            ...this.dash.Charts.Activity.CancelledOrders.map((value, key) => [key, 0, value]).filter((item) => item[2] !== 0)
          ],
          label: {
            show: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  }

  getLast10Days(): string[] {
    const last10 = [];
    const day = new Date();
    day.setDate(day.getDate() - 9);
    for (let i = 0; i < 10; i++) {
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(day);
      const da = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(day);
      last10.push(`${mo} ${da}`);
      day.setDate(day.getDate() + 1);
    }
    return last10;
  }
}
