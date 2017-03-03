var c1 = document.getElementById( 'c1' ),//定义的主要背景色调
	ctx1 = c1.getContext( '2d' ),
	c2 = document.getElementById( 'c2' ),
	ctx2 = c2.getContext( '2d' ),
	twopi = Math.PI * 2,
	parts = [],
	sizeBase,
	ch,//window.innerHeight
	cw,//window.innerWidth
	opt,
	hue,
	count;

function rand( min, max ) {
	return Math.random() * ( max - min ) + min;
}
/**
 * 设置颜色
 * @param h
 * @param s
 * @param l
 * @param a
 * @returns {string}
 */
function hsla( h, s, l, a ) {
	return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
}
/**
 * 创建背景
  */
function create() {
	sizeBase = cw + ch;
	count = Math.floor( sizeBase*0.3),
	hue = rand( 0, 360 ),
	opt = {
		radiusMin: 1,
		radiusMax: sizeBase * 0.04,
		blurMin: 10,
		blurMax: sizeBase * 0.04,
		hueMin: hue,
		hueMax: hue + 100,
		saturationMin: 10,
		saturationMax: 70,
		lightnessMin: 20,
		lightnessMax: 50,
		alphaMin: 0.1,
		alphaMax: 0.5
	}
	ctx1.clearRect( 0, 0, cw, ch );
	//globalCompositeOperation 属性设置或返回如何将一个源（新的）图像绘制到目标（已有）的图像上 默认属性：source-over。  http://www.cnblogs.com/staven/p/4760960.html
	ctx1.globalCompositeOperation = 'lighter';
	while( count-- ) {
		var radius = rand( opt.radiusMin, opt.radiusMax ),
			blur = rand( opt.blurMin, opt.blurMax ),
			x = rand( 0, cw ),
			y = rand( 0, ch ),
			hue = rand(opt.hueMin, opt.hueMax ),
			saturation = rand( opt.saturationMin, opt.saturationMax ),
			lightness = rand(  opt.lightnessMin, opt.lightnessMax ),
			alpha = rand( opt.alphaMin, opt.alphaMax );

		ctx1.shadowColor = hsla( hue, saturation, lightness, alpha );
		ctx1.shadowBlur = blur;
		ctx1.beginPath();
		ctx1.arc( x, y, radius, 0, twopi );//创建弧/曲线（用于创建圆或部分圆）  x 坐标 、 y 坐标、半径、起始角、结束角
		ctx1.closePath();
		ctx1.fill();
	}
	
	parts.length = 0;
	for( var i = 0; i < Math.floor( ( cw + ch ) * 0.03 ); i++ ) {
		parts.push({
			radius: rand( 1, sizeBase * 0.03 ),
			x: rand( 0, cw ),
			y: rand( 0, ch ),
			angle: rand( 0, twopi ),
			vel: rand( 0.1, 0.5 ),
			tick: rand( 0, 10000 )
		});
	}
	console.log(parts)
}

function init() {
	resize();
	create();
	loop();
}
/**
 * 回执透明求球体
 */
function loop() {

	requestAnimationFrame( loop );//重复运动帧动画

	ctx2.clearRect( 0, 0, cw, ch );
	//ctx2.globalCompositeOperation = 'source-over';
	ctx2.shadowBlur = 0;
	ctx2.drawImage( c1, 0, 0 );
	ctx2.globalCompositeOperation = 'light';
	
	var i = parts.length;
	ctx2.shadowBlur = 15;
	ctx2.shadowColor = '#fff';
	while( i-- ) {
		var part = parts[ i ];
		
		part.x += Math.cos( part.angle ) * part.vel;
		part.y += Math.sin( part.angle ) * part.vel;
		part.angle += rand( -0.05, 0.05 );
		
		ctx2.beginPath();
		ctx2.arc( part.x, part.y, part.radius, 0, twopi );
		ctx2.fillStyle = hsla( 0, 0, 100, 0.075 + Math.cos( part.tick * 0.02 ) * 0.05 );
		ctx2.fill();
		//运动路径遍历修改
		if( part.x - part.radius > cw ) { part.x = -part.radius }
		if( part.x + part.radius < 0 )  { part.x = cw + part.radius }
		if( part.y - part.radius > ch ) { part.y = -part.radius }
		if( part.y + part.radius < 0 )  { part.y = ch + part.radius }
		
		part.tick++;
	}
}

function resize() {
	cw = c1.width = c2.width = window.innerWidth,
	ch = c1.height = c2.height = window.innerHeight;
	create();
}

function click() {
	create()
}

window.addEventListener( 'resize', resize );
window.addEventListener( 'click', click );

init();