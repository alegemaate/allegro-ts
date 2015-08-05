var man,apple;
var munch;
var apple_x=200,apple_y=200;
var player_x=100,player_y=100;
var score = 0;

function draw()
{
	clear_to_color(canvas,makecol(0,0,0));
	draw_sprite(canvas,man,player_x,player_y);
	draw_sprite(canvas,apple,apple_x,apple_y);
	textout(canvas,font,"Score: " + score,10,20,24,makecol(255,255,255));
}

function update()
{
	if (key[KEY_UP]) player_y-=4;
	if (key[KEY_DOWN]) player_y+=4;
	if (key[KEY_LEFT]) player_x-=4;
	if (key[KEY_RIGHT]) player_x+=4;
	if (distance(player_x,player_y,apple_x,apple_y)<20)
	{
		play_sample(munch);
		apple_x = rand()%SCREEN_W;
		apple_y = rand()%SCREEN_H;
		score++;
		log("Apple eaten!");
	}
}

function main()
{
	enable_debug('debug');
	allegro_init_all("canvas_id", 640, 480);
	man = load_bmp("man.png");
	apple = load_bmp("apple.png");
	munch = load_sample("munch.mp3");
	
	ready(function(){
		loop(function(){
			update();
			draw();
		},BPS_TO_TIMER(60));
	});
	return 0;
}
END_OF_MAIN();
