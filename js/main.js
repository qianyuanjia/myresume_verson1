window.onload=function(){
	var aBotBtn=document.getElementsByClassName('bot_btn');
	var pageHeight=document.documentElement.clientHeight;
	var oIdx2=document.getElementById('idx2');
	var colorArr=["#B65AF9","#00FFFF","#BAFD4D"];
	var textArr=["英语六级587分","熟练使用办公软件","善于分析拓展"];
	var oStrength=oIdx2.getElementsByClassName('strength')[0];
	var oIdx4=document.getElementById('idx4');
	var oIdx5=document.getElementById("idx5");
	var oSkill=oIdx5.getElementsByClassName('skill')[0];
	var strenColor=['pink','cyan','lightgreen','yellow','#ccc','#E9F01D','#FFEBCC','#C7FFEC'];
	var strenText=['英语阅读','报告撰写','统计绘图','数据分析','办公软件','网页制作','photoshop','数据库mysql'];
	var flag=true;
	var can_flag=true;
	var stren_flag=true;
	var deg=0;
	
	for(var i=0;i<aBotBtn.length;i++){
		aBotBtn[i].index=i;
		aBotBtn[i].onclick=function(){
			pageDown(this,(this.index+1)*pageHeight);
		}
		shakeBtn(aBotBtn[i],6,2);		
	}
	window.onscroll=function(){
		if(flag && getScrollTop()>pageHeight-200){
			drawSvg(oStrength,colorArr,textArr);
			flag=false;
		}
		if(can_flag && getScrollTop()>pageHeight-200){
			createCanvas(oIdx4);
			can_flag=false;	
		}
		if(stren_flag && getScrollTop()>2*pageHeight-200){
				drawStren(oSkill,deg,strenColor,strenText);
				setInterval(function(){
					deg+=1;
					if(deg>360) deg=0;
					oSkill.removeChild(oSkill.children[0]);
					drawStren(oSkill,deg,strenColor,strenText);
				},500);
			stren_flag=false;	
		}
	}


};
function getScrollTop(){
	return document.documentElement.scrollTop || document.body.scrollTop;
}
function setArr(num,step){
	var arr=[];
	for(var i=num;i>0;i-=step){
		arr.push(i,-i);
	}
	arr.push(0);
	return arr;
}

function shakeBtn(obj,num,step){
	var shakeArr=setArr(num,step);
	var idx=0;
	var startTop=obj.offsetTop;
	setInterval(function(){
		if(idx==shakeArr.length){
			idx=0;
		}
		obj.style.top=startTop+shakeArr[idx++]+'px';
	},200);
}

function setScrollTop(dis){
	document.documentElement.scrollTop=document.body.scrollTop=dis;
}

function pageDown(obj,pageHeight,callback){
	clearInterval(obj.timer);
	var startTop=getScrollTop();
	var dis=pageHeight-startTop;
	obj.timer=setInterval(function(){
		var nowTop=getScrollTop();
		var speed=(dis-(nowTop-startTop))/6;
		if(Math.abs(speed)<=1){
			speed=0;
		}
		setScrollTop(getScrollTop()+speed);
		if(speed==0){
			clearInterval(obj.timer);
			setScrollTop(pageHeight);
			callback&&callback();
		}
	},20);
}

function drawSvg(oParent,colorArr,textArr){
	var oSvg=createTag('svg',{
		xmlns:"http://www.w3.org/2000/svg",
		width:"100%",
		height:"100%"
	});
	for(var i=0;i<3;i++){
		var oG=createTag('g',null);
		var oCir=createTag('circle',{
			cx:110+160*i+'',
			cy:"100" ,
			r:"50" ,
			fill:colorArr[i]
		});
		var oAni=createTag('animate',{
			attributeName:"r" ,
			dur:"0.6" ,
			from:"0" ,
			to:"50"
		});
		var oText=createTag('text',{
			x:110+160*i+'',
			y:"108" ,
			"text-anchor":"middle" ,
			"font-size":"12" ,
			fill:"red" ,
			"font-weight":"bold"
		});
		oText.textContent=textArr[i];
		oCir.appendChild(oAni);
		oG.appendChild(oCir);
		oG.appendChild(oText);
		oSvg.appendChild(oG);
	}
	oParent.appendChild(oSvg);
}

function createTag(tagName,attrs){
	var ns="http://www.w3.org/2000/svg";
	var oTag=document.createElementNS(ns,tagName);
	for(var attr in attrs){
		oTag.setAttribute(attr,attrs[attr]);
	}

	return oTag;
}

function cirAnimation(canvasId,initialRadius,cirArrInterval,RadiusDelta,alphaDelta){
	var oCan=document.getElementById(canvasId);
	var oCtx=oCan.getContext('2d');
	var cirArr=[];
	//设置定时器用于生成圆点数组的信息
	setInterval(function(){
		var x=Math.floor(Math.random()*oCan.width);
		var y=Math.floor(Math.random()*oCan.height);
		var R=Math.floor(Math.random()*256);
		var G=Math.floor(Math.random()*256);
		var B=Math.floor(Math.random()*256);
		var A=1;
		cirArr.push({
			x:x,
			y:y,
			r:initialRadius,
			R:R,
			G:G,
			B:B,
			A:A
		});
	},cirArrInterval);
	setInterval(function(){
		oCtx.clearRect(0,0,oCan.width,oCan.height);
		for(var i=0;i<cirArr.length;i++){				
			oCtx.beginPath();
			oCtx.fillStyle='rgba('+cirArr[i].R+','+cirArr[i].G+','+cirArr[i].B+','+cirArr[i].A+')';
			oCtx.moveTo(cirArr[i].x,cirArr[i].y);
			oCtx.arc(cirArr[i].x,cirArr[i].y,cirArr[i].r,0,2*Math.PI,false);
			oCtx.closePath();
			oCtx.fill();				
		}

		for(var i=0;i<cirArr.length;i++){
			cirArr[i].r+=RadiusDelta;
			cirArr[i].A-=alphaDelta;
			if(cirArr[i].A<=0){
				cirArr.splice(i,1);
			}
		}
	},1000/60);
}

function createCanvas(oParent,callback){
	var oCan=document.createElement('canvas');
	oCan.width=document.documentElement.clientWidth;
	oCan.height=document.documentElement.clientHeight;
	oCan.id="idx3";
	oParent.appendChild(oCan);
	cirAnimation('idx3',15,300,2,0.01);
	callback&&callback();
}


function drawStren(oParent,deg,strenColor,strenText){
	var oSvg=createTag('svg',{
			xmlns:"http://www.w3.org/2000/svg",
			width:"100%",
			height:"100%"
		});
	for(var i=0;i<strenColor.length;i++){
		var oLine=createTag('line',{
			x1:"500" ,
			y1:"300" ,
			x2:500+200*Math.cos((deg+45*i)*Math.PI/180), 
			y2:300+200*Math.sin((deg+45*i)*Math.PI/180),  
			stroke:strenColor[Math.floor(Math.random()*8)],
			'stroke-width':"2"
		});
		var oCir=createTag('circle',{
			cx:500+200*Math.cos((deg+45*i)*Math.PI/180),
			cy:300+200*Math.sin((deg+45*i)*Math.PI/180),
			r:"50" ,
			fill:strenColor[Math.floor(Math.random()*8)],
			stroke:strenColor[Math.floor(Math.random()*8)],
			'stroke-width':"1"
		});
		var oText=createTag('text',{
			x:500+200*Math.cos((deg+45*i)*Math.PI/180), 
			y:308+200*Math.sin((deg+45*i)*Math.PI/180), 
			'text-anchor':"middle" ,
			fill:'maroon'
		});
		oText.textContent=strenText[i];
		oSvg.appendChild(oLine);
		oSvg.appendChild(oCir);
		oSvg.appendChild(oText);
	}
		oCen=createTag('circle',{
			cx:"500" ,
			cy:"300" ,
			r:"60" ,
			fill:strenColor[Math.floor(Math.random()*8)] ,
			stroke:strenColor[Math.floor(Math.random()*8)], 
			'stroke-width':"1"
		});
		oCenTex=createTag('text',{
			x:"500" ,
			y:"308" ,
			'text-anchor':"middle", 
			fill:"#999"
		});
		oCenTex.textContent="strength";
		oSvg.appendChild(oCen);
		oSvg.appendChild(oCenTex);
		oParent.appendChild(oSvg);
}