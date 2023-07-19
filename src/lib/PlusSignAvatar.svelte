<!-- Based on https://stackoverflow.com/a/26681130/7812829 -->

<div class="avatar">

</div>

<style>
.avatar {
  /* This image is 687 wide by 1024 tall, similar to your aspect ratio */
  /* https://ih1.redbubble.net/image.1964762931.6908/pp,504x498-pad,600x600,f8f8f8.jpg */
  background-image: url('/plus-sign.png');
  
  /* make a square container */
  width: 21px;
  height: 21px;

  /* fill the container, preserving aspect ratio, and cropping to fit */
  background-size: cover;

  /* center the image vertically and horizontally */
  background-position: top center;

  /* round the edges to a circle with border radius 1/2 container size */
  border-radius: 50%;
}
</style>

