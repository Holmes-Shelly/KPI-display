(function(){
'use strict';
//0730实现了右侧gauge图表的点击放大功能
//0806尝试网页整体angularjs化，实现了左侧折线图和放大gauge的ui-option，但右侧四小图较难实现
//0807实现了网页整体的angularjs化，以及统一数据的来源
//0808填入了具体的数据，形成了一个可用的版本
//0809放弃http获取数据的方法，使用excel直接生成kpidata.js，但遇到中文乱码问题
//0810实现了通过excel输出js文件来更新数据
//0813填入了左表数据，尝试修复打印ngrepeat的颜色不显示问题，失败
	
angular.module('DataTableApp', [])
.controller('DataTableController', DataTableController)
.service('DataTableService', DataTableService)
.directive('chartTop', chartTop)
.directive('chartLeft', chartLeft)
.directive('chartRight', chartRight)

function chartRight() {
	return {
		restrict: 'E',
		scope: false,
		link: function(scope, element, attrs){

			//console.log("gaugeTag is", scope.gaugeTag[attrs.chartIndex]);
			var rightChartOption = {
				// title: {
					// x: "center",
					// bottom: 0,
					// text: scope.gaugeTag[attrs.chartIndex],
					// subtext: scope.gaugeDataSrc[attrs.chartIndex].toString()+'%',
					// textStyle: {
						// fontWeight: 'normal',
						// fontSize: 20,
						// color: "#323232"
					// },
					// subtextStyle: {
						// fontWeight: 'normal',
						// fontSize: 20,
						// color: 'red'
					// },
				// },
				series: [{ 
					type: 'gauge',
					center: ['50%', '65%'], // 默认全局居中  
					radius: 100,
					splitNumber: 5, //刻度数量
					min: 0,
					max:100,
					startAngle: 200,
					endAngle: -20,
				 
					axisLine: {
						show: true,
						lineStyle: {
							width: 2,
							shadowBlur: 0,
							color: [
								[1, '#8f8f8f']
							]
						}
					},
					axisTick: {
						show: true,
						lineStyle: {
							color: '#8f8f8f',
							width: 1
						},
						length: 8,
						splitNumber: 8
					},
					splitLine: {
						show: true,
						length: 12,
						lineStyle: {
							color: '#8f8f8f',
						}
					},
					axisLabel: {
						distance: 2,
						textStyle: {
							color: "#8f8f8f",
							fontSize: "14",
							fontWeight:"bold"
						},
							formatter: function(e) {
							switch(e + "") {
								case "20":
									return "40";

								case "40":
									return "60";
									
								case "60":
									return "80";
										
								case "80":
									return "90";
										
								case "100":
									return "100";
									
								default:
									return e;
							}
						},
						textStyle: {
							fontSize: 12,
							fontWeight: ""
						}

					},
					pointer: { //仪表盘指针
						show: 0
					},
					detail: {
						show: false
					},
				},
				{
					type: 'gauge',
					startAngle: 200,
					endAngle: -20,
					radius: 70,
					center: ['50%', '65%'], // 默认全局居中  
					 
					min: 0,
					max: 100,

					axisLine: {
						show: false,
						lineStyle: {
							width:10,
							shadowBlur: 0,
							color: [
								[0.2, 'red'],
								[0.4, 'orange'],
								[0.6, 'yellow'],
								[0.8, '#33ff00'],
								[1, 'blue']
							]
						}
					},
					axisTick: {
						show: false,
						 
					},
					splitLine: {
						show: false,
						length: 20,

					},

					axisLabel: {
						show:false
					},
					pointer: {
						show: true,
					},
					detail: {
						show:false,
						offsetCenter: [0, 0],
						textStyle: {
							fontSize: 30
						}
					},
					itemStyle: {
					normal: {
						color: "#323232",
						
					}
				},
					data: [{
						name: "",
						value: Math.floor(scope.gaugeData[attrs.chartIndex]),
					}]
				},
				{
					startAngle: 200,
					endAngle: -20,
					name: '实际完成',
					type: 'gauge',
					center: ['50%', '65%'], // 默认全局居中  
					radius:50,
					min: 0,
					max: 100,
					splitNumber: 0,
					axisLine: { // 坐标轴线  
						lineStyle: {
							color: [
								[scope.gaugeData[attrs.chartIndex]/100, '#dddddd'],
								[1, 'black']
							], // 属性lineStyle控制线条样式  
							width: 4
						}
					},

					 
					axisLabel: { // 坐标轴小标记  
						textStyle: { // 属性lineStyle控制线条样式  
							fontWeight: 'bolder',
							fontSize: 16,
							color: 'rgba(30,144,255,0)',
						}
					},
					splitLine: { // 分隔线  
						length: 10, // 属性length控制线长  
						lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式  
							width: 0,
							color: '#444'
						}
					},
					pointer: { // 分隔线 指针  
						color: '#666666',
						width: 0,
						length: 230
					},
					detail: {
						formatter:'{value}%',
						color: 'red',
					},
					data: [{value: scope.gaugeDataSrc[attrs.chartIndex], name: scope.gaugeTag[attrs.chartIndex].toString()}]
				}, 
				]
			};
            //console.log("chartright element[0] is", element[0]);				
			var rightChart = echarts.init(element[0]);
			rightChart.setOption(rightChartOption);
		},
	}
}

function chartLeft() {
	return {
		restrict: 'E', 
		link: function(scope, element, attrs){
			
			// 基于准备好的dom，初始化echarts图表
			//console.log("scope is", scope);
			//console.log("element[0] is", element[0]);
			var leftChart = echarts.init(element[0]);
			
			var leftChartOption = eval('(' + attrs.uiOption + ')');
			leftChart.setOption(leftChartOption);

		}	
	}
}

function chartTop(){  
    return {  
        restrict: 'E',  
		link: function(scope, element, attrs){
			
			// 基于准备好的dom，初始化echarts图表
			//console.log("charttop element[0] is", element[0]);
			var topChart = echarts.init(element[0]);

			//监听options变化
			attrs.$observe('uiOption', function () {
				//console.log("attrs.uiOption is", attrs.uiOption);
				//console.log("attrs.uiOption after eval is", eval('(' + attrs.uiOption + ')'));
				var topChartOption = eval('(' + attrs.uiOption + ')');
				topChart.setOption(topChartOption);
			}, true);

		}	
    };  
}


DataTableController.$inject = ['DataTableService', '$scope'];
function DataTableController(DataTableService, $scope){
	var dataShow = this;
	
	//返回一个数组前n项累加的程序
	function listSum(list) {
		var newList = [];
		newList.push(list[0]);
		for (var i=1; i<list.length; i++) {
			newList.push(list[i] + newList[i-1]);
		};
		return newList
	};
	
	//从service中获取数据标签和原始数据
	dataShow.yearPlanData = DataTableService.getYearPlanData();
	dataShow.yearDoneData = DataTableService.getYearDoneData();
	dataShow.yearPlanSumData = listSum(dataShow.yearPlanData);
	dataShow.yearDoneSumData = listSum(dataShow.yearDoneData);
	
	//从service中获取gauge数据标签和原始数据
	dataShow.gaugeTag = DataTableService.getGaugeTag();
	dataShow.gaugeDataSrc = DataTableService.getDataSrc();
	
    //用类似于对数坐标的方式处理原始数据
	
	//为简化代码，先写一个处理函数
	function numConvert(num){
	    if (num <= 40){
	        return num/2
	    }
    	else if (num <= 80){
	        return num-20
    	}
	    else{
	        return num*2-100
	    }
	};
	
	//建立新数组，处理完成后逐个列入
	dataShow.gaugeData = [];
	var num;
	for (num in dataShow.gaugeDataSrc){
		dataShow.gaugeData.push(numConvert(dataShow.gaugeDataSrc[num]));
    };
	
	//把dataShow的数据列入$scope,方便binding
	$scope.gaugeTag = dataShow.gaugeTag;
	$scope.gaugeData = dataShow.gaugeData;
	$scope.gaugeDataSrc = dataShow.gaugeDataSrc;

	//默认不显示放大版gauge油耗表
	dataShow.showTopChart = false;
	
	//从service中获取指标数据
	dataShow.indicator = DataTableService.getIndicator();

    //定义点击后的行为
	dataShow.clickHappened = function(n){
		
		//允许显示放大版油耗表
		dataShow.showTopChart = true;
		
		//从service中获取title细节，带有参数n
		dataShow.topTitle = DataTableService.getTitle(n);
		//console.log(dataShow.topTitle);
		
		//将echarts需要的数据赋给dataShow
		dataShow.chartTag = dataShow.gaugeTag[n];
		dataShow.chartData = dataShow.gaugeData[n];
		dataShow.chartDataSrc = dataShow.gaugeDataSrc[n];

	};
	
	//二次点击时隐藏放大版油耗表
	dataShow.clickClosed = function(){
		dataShow.showTopChart = false;
	}
};

DataTableService.$inject = ['$http'];
function DataTableService($http){
	var service = this;
	
	//获取标签和数据，感觉此处可以和kpiData包括进一个json，放进一个txt里，然后用异步http获取，分配
	service.yearPlanData = [44, 24, 48, 12, 48, 64, 102, 68, 99, 73, 41, 99];
	service.yearDoneData = [41, 23, 51, 12, 49, 64, 102, 66, 96, 71];
	service.gaugeTag = ['总体计划', '年度计划', '月度计划', '行动项进度'];
	// service.gaugeDataSrc = [100, 97.8, 100, 92.9];
	
	//从datasrc中获取两项数据
	service.title = title;
	service.gaugeDataSrc = gaugeDataSrc;
	service.kpiData = kpiData;
	
    //获取多项数据的途径
	service.getGaugeTag = function(){
		return service.gaugeTag;
	};
	service.getDataSrc = function(){
		return service.gaugeDataSrc;
	};
	service.getTitle = function(n){
		return service.title[n];
	};	
	service.getIndicator = function(){
		return service.kpiData;
	};
	service.getYearPlanData = function(){
		return service.yearPlanData;
	};
	service.getYearDoneData = function(){
		return service.yearDoneData;
	};
};
	
})()