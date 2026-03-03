import { fix_to_rad } from "./math";
import { type BITMAP } from "./types";

/**
 * Blit
 *
 * @remarks
 * Map sprite to screen
 *
 * @param source - source bitmap
 * @param dest - destination bitmap
 * @param source_x - source origin x
 * @param source_y - source origin y
 * @param dest_x - destination origin x
 * @param dest_y - destination origin y
 * @param width - width of sprite
 * @param height - height of sprite
 *
 * @allegro 1.15.1
 */
export function blit(
  source: BITMAP | undefined,
  dest: BITMAP | undefined,
  source_x: number,
  source_y: number,
  dest_x: number,
  dest_y: number,
  width: number,
  height: number,
): void {
  if (!source?.canvas || !dest?.context) {
    return;
  }
  dest.context.drawImage(
    source.canvas,
    source_x,
    source_y,
    source.w,
    source.h,
    dest_x,
    dest_y,
    width,
    height,
  );
}

/**
 * Scaled blit
 *
 * @remarks
 * Draws a scaled chunk of an image on a bitmap. It's not slower.
 *
 * @param source - source bitmap
 * @param dest - destination bitmap
 * @param source_x - source origin x
 * @param source_y - source origin y
 * @param source_width - source width
 * @param source_height - source height
 * @param dest_x - destination origin x
 * @param dest_y - destination origin y
 * @param dest_width - destination width
 * @param dest_height - destination height
 *
 * @allegro 1.15.2
 */
export function stretch_blit(
  source: BITMAP | undefined,
  dest: BITMAP | undefined,
  source_x: number,
  source_y: number,
  source_width: number,
  source_height: number,
  dest_x: number,
  dest_y: number,
  dest_width: number,
  dest_height: number,
): void {
  if (!source?.canvas || !dest?.context) {
    return;
  }
  dest.context.drawImage(
    source.canvas,
    source_x,
    source_y,
    source_width,
    source_height,
    dest_x,
    dest_y,
    dest_width,
    dest_height,
  );
}

/**
 * Masked blit
 *
 * @remarks
 * Like blit(), but skips transparent pixels. Since canvas bitmaps use alpha
 * channels for transparency, this is equivalent to blit() in truecolor mode.
 *
 * @allegro 1.15.3
 */
export function masked_blit(
  sprite: BITMAP | undefined,
  dest: BITMAP | undefined,
  source_x: number,
  source_y: number,
  dest_x: number,
  dest_y: number,
  width: number,
  height: number,
): void {
  blit(sprite, dest, source_x, source_y, dest_x, dest_y, width, height);
}

/**
 * Masked stretch blit
 *
 * @remarks
 * Like masked_blit(), but can scale images so source and destination
 * rectangles don't need to be the same size.
 *
 * @allegro 1.15.4
 */
export function masked_stretch_blit(
  sprite: BITMAP | undefined,
  dest: BITMAP | undefined,
  source_x: number,
  source_y: number,
  source_w: number,
  source_h: number,
  dest_x: number,
  dest_y: number,
  dest_w: number,
  dest_h: number,
): void {
  stretch_blit(
    sprite,
    dest,
    source_x,
    source_y,
    source_w,
    source_h,
    dest_x,
    dest_y,
    dest_w,
    dest_h,
  );
}

/**
 * Draws a sprite
 *
 * @remarks
 * This is probably the fastest method to get images on screen.
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 *
 * @allegro 1.15.5
 */
export function draw_sprite(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
): void {
  if (!sprite?.canvas || !bmp?.context) {
    return;
  }
  bmp.context.drawImage(sprite.canvas, x, y);
}

/**
 * Draws a stretched sprite
 *
 * @remarks
 * Stretch sprite
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 * @param w - width
 * @param h - height
 *
 * @allegro 1.15.6
 */
export function stretch_sprite(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  bmp.context.drawImage(sprite.canvas, x, y, w, h);
}

/**
 * Draw sprite vertical flip
 *
 * @remarks
 * Flip a sprite vertically
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 *
 * @allegro 1.15.7
 */
export function draw_sprite_v_flip(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  bmp.context.save();
  bmp.context.translate(x, y);
  bmp.context.scale(-1, 1);
  bmp.context.translate(-x - sprite.w, -y);
  bmp.context.drawImage(sprite.canvas, x, y);
  bmp.context.restore();
}

/**
 * Draw sprite horizontal flip
 *
 * @remarks
 * Flip a sprite horizontal
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 *
 * @allegro 1.15.7
 */
export function draw_sprite_h_flip(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  bmp.context.save();
  bmp.context.translate(x, y);
  bmp.context.scale(1, -1);
  bmp.context.translate(-x, -y - sprite.h);
  bmp.context.drawImage(sprite.canvas, x, y);
  bmp.context.restore();
}

/**
 * Draw sprite horizontal and vertical flip
 *
 * @remarks
 * Flip a sprite horizontal and vertical
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 *
 * @allegro 1.15.7
 */
export function draw_sprite_vh_flip(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  bmp.context.save();
  bmp.context.translate(x, y);
  bmp.context.scale(-1, -1);
  bmp.context.translate(-x - sprite.w, -y - sprite.h);
  bmp.context.drawImage(sprite.canvas, x, y);
  bmp.context.restore();
}

/**
 * Draw transparent sprite
 *
 * @remarks
 * Not implemented
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 *
 * @allegro 1.15.8
 *
 * @alpha
 */
export function draw_trans_sprite(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
): void {
  draw_sprite(bmp, sprite, x, y);
}

/**
 * Draw lit sprite
 *
 * @remarks
 * In truecolor mode, lights the sprite using the alpha level specified by
 * color (0-255), where 0 means no change and 255 means fully lit (white).
 * Uses a temporary canvas with source-atop compositing to apply the light
 * only to non-transparent pixels.
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 * @param color - light level from 0 (no light) to 255 (fully white)
 *
 * @allegro 1.15.9
 */
export function draw_lit_sprite(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  color: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  const tmp = document.createElement("canvas");
  tmp.width = sprite.w;
  tmp.height = sprite.h;
  const ctx = tmp.getContext("2d");
  if (!ctx) {
    return;
  }
  ctx.drawImage(sprite.canvas, 0, 0);
  ctx.globalCompositeOperation = "source-atop";
  ctx.globalAlpha = color / 255;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, sprite.w, sprite.h);
  bmp.context.drawImage(tmp, x, y);
}

/**
 * Draw gouraud sprite
 *
 * @remarks
 * Not implemented
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 * @param c1 - color 1
 * @param c2 - color 2
 * @param c3 - color 3
 * @param c4 - color 4
 *
 * @allegro 1.15.10
 *
 * @alpha
 */
export function draw_gouraud_sprite(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  c1: number,
  c2: number,
  c3: number,
  c4: number,
): void {
  void c1;
  void c2;
  void c3;
  void c4;
  draw_sprite(bmp, sprite, x, y);
}

/**
 * Draw character ex
 *
 * @remarks
 * Not implemented
 *
 * @allegro 1.15.11
 *
 * @alpha
 */
export function draw_character_ex(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  color: number,
  bg: number,
): void {
  void color;
  void bg;
  draw_sprite(bmp, sprite, x, y);
}

/**
 * Rotate sprite
 *
 * @remarks
 * Draws a rotated sprite
 * Draws a sprite rotating it around its centre point.
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 * @param angle - angle of rotation from 0-256
 *
 * @allegro 1.15.12
 */
export function rotate_sprite(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  angle: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  const u = sprite.w / 2;
  const v = sprite.h / 2;
  bmp.context.save();
  bmp.context.translate(x + u, y + v);
  bmp.context.rotate(fix_to_rad(angle));
  bmp.context.translate(-x - u, -y - v);
  bmp.context.drawImage(sprite.canvas, x, y);
  bmp.context.restore();
}

/**
 * Rotate sprite with vertical flip
 *
 * @remarks
 * Rotates sprite around its origin and flips it
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 * @param angle - angle of rotation from 0-256
 *
 * @allegro 1.15.13
 */
export function rotate_sprite_v_flip(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  angle: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  const u = sprite.w / 2;
  const v = sprite.h / 2;
  bmp.context.save();
  bmp.context.translate(x + u, y + v);
  bmp.context.rotate(fix_to_rad(angle));
  bmp.context.translate(-x - u, -y - v);
  bmp.context.translate(x, y);
  bmp.context.scale(-1, 1);
  bmp.context.translate(-x - sprite.w, -y);
  bmp.context.drawImage(sprite.canvas, x, y);
  bmp.context.restore();
}

/**
 * Draws a rotated sprite and scales it
 *
 * @remarks
 * Draws a sprite rotating it around its centre point. The sprite is also scaled. You can omit sy value for uniform scaling. YOu can use negative scale for flipping. Scaling is around the center. The sprite will be centred and rotated around its centre.
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 * @param angle - angle of rotation from 0-256
 * @param sx - horizontal scale, 1.0 is unscaled
 * @param sy - vertical scale, 1.0 is unscaled
 *
 * @allegro 1.15.14
 */
export function rotate_scaled_sprite(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  angle: number,
  scale: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  const u = sprite.w / 2;
  const v = sprite.h / 2;
  bmp.context.save();
  bmp.context.translate(x + u, y + v);
  bmp.context.rotate(fix_to_rad(angle));
  bmp.context.scale(scale, scale);
  bmp.context.translate(-x - u, -y - v);
  bmp.context.drawImage(sprite.canvas, x, y);
  bmp.context.restore();
}

/**
 * Rotate scaled sprite with vertical flip
 *
 * @remarks
 * Rotates a scaled sprite and vertically flips it
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 * @param angle - angle of rotation from 0-256
 * @param scale - scale of sprite
 *
 * @allegro 1.15.15
 */
export function rotate_scaled_sprite_v_flip(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  angle: number,
  scale: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  const u = sprite.w / 2;
  const v = sprite.h / 2;
  bmp.context.save();
  bmp.context.translate(x + u, y + v);
  bmp.context.rotate(fix_to_rad(angle));
  bmp.context.scale(scale, scale);
  bmp.context.translate(-x - u, -y - v);
  bmp.context.translate(x, y);
  bmp.context.scale(-1, 1);
  bmp.context.translate(-x - sprite.w, -y);
  bmp.context.drawImage(sprite.canvas, x, y);
  bmp.context.restore();
}

/**
 * Draws a sprite rotated around an arbitrary point
 *
 * @remarks
 * Draws a sprite rotating it around a given point. Sprite is drawn centered to the pivot point. The pivot point is relative to top-left corner of the image.
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 * @param cx - Pivot point x
 * @param cy - Pivot point y
 * @param angle - angle of rotation from 0-256
 *
 * @allegro 1.15.16
 */
export function pivot_sprite(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  bmp.context.save();
  bmp.context.translate(x, y);
  bmp.context.rotate(fix_to_rad(angle));
  bmp.context.translate(-cx, -cy);
  bmp.context.drawImage(sprite.canvas, 0, 0);
  bmp.context.restore();
}

/**
 * Pivot sprite with vertical flip
 *
 * @remarks
 * Draws a sprite rotating it around a given point.
 * Then flips it.
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 * @param cx - Pivot point x
 * @param cy - Pivot point y
 * @param angle - angle of rotation from 0-256
 *
 * @allegro 1.15.17
 */
export function pivot_sprite_v_flip(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  bmp.context.save();
  bmp.context.translate(x, y);
  bmp.context.rotate(fix_to_rad(angle));
  bmp.context.translate(-cx, -cy);
  bmp.context.translate(x, y);
  bmp.context.scale(-1, 1);
  bmp.context.translate(-x - sprite.w, -y);
  bmp.context.drawImage(sprite.canvas, 0, 0);
  bmp.context.restore();
}

/**
 * Draws a sprite rotated around an arbitrary point and scaled
 *
 * @remarks
 * Draws a sprite rotating it around a given point. The sprite is also scaled. Sprite is drawn centered to the pivot point. The pivot point is relative to top-left corner of the image  before scaling. You can omit sy value for uniform scaling. You can use negative scale for flipping.
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 * @param cx - Pivot point x
 * @param cy - Pivot point y
 * @param angle - angle of rotation from 0-256
 * @param scale - scale
 *
 * @allegro 1.15.18
 */
export function pivot_scaled_sprite(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number,
  scale: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }

  const u = scale * cx;
  const v = scale * cy;
  bmp.context.save();
  bmp.context.translate(x, y);
  bmp.context.rotate(fix_to_rad(angle));
  bmp.context.translate(-u, -v);
  bmp.context.scale(scale, scale);
  bmp.context.drawImage(sprite.canvas, 0, 0);
  bmp.context.restore();
}

/**
 * Draws a sprite rotated around an arbitrary point and scaled and flipped.
 *
 * @remarks
 * Draws a sprite rotating it around a given point. The sprite is also scaled. Sprite is drawn centered to the pivot point. The pivot point is relative to top-left corner of the image  before scaling. You can omit sy value for uniform scaling. You can use negative scale for flipping.
 *
 * @param bmp - target bitmap
 * @param sprite - sprite bitmap
 * @param x - x position
 * @param y - y position
 * @param cx - Pivot point x
 * @param cy - Pivot point y
 * @param angle - angle of rotation from 0-256
 * @param scale - scale amount
 *
 * @allegro 1.15.19
 */
export function pivot_scaled_sprite_v_flip(
  bmp: BITMAP | undefined,
  sprite: BITMAP | undefined,
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number,
  scale: number,
): void {
  if (!bmp?.context || !sprite?.canvas) {
    return;
  }
  const u = scale * cx;
  const v = scale * cy;

  bmp.context.save();
  bmp.context.translate(x, y);
  bmp.context.rotate(fix_to_rad(angle));
  bmp.context.translate(-u, -v);
  bmp.context.scale(scale, scale);
  bmp.context.translate(x, y);
  bmp.context.scale(-1, 1);
  bmp.context.translate(-x - sprite.w, -y);
  bmp.context.drawImage(sprite.canvas, 0, 0);
  bmp.context.restore();
}
