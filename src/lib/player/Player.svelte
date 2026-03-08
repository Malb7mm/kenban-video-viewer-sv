<script lang="ts">
  import SpeedIcon from "../../assets/SpeedIcon.svelte";
  import VolumeIcon from "../../assets/VolumeIcon.svelte";
  import SeekBar from "./SeekBar.svelte";
  import VerticalSlider from "./VerticalSlider.svelte";
  import VideoWrapper from "./VideoWrapper.svelte";

  let fileInputEl: HTMLInputElement;
  let youtubeUrlText: string = $state("");
  let videoWrapperEl: VideoWrapper | undefined = $state(undefined);
  let seekBarEl: SeekBar;
  let duration: number = $state(0);
  let showSplash: boolean = $state(true);
  let isLoaded: boolean = $state(false);
  let playButtonText: string = $state("-");
  let showVolumeSlider: boolean = $state(false);
  let showSpeedSlider: boolean = $state(false);
  let volume: number = $state(30);
  let speed: number = $state(1);

  // D&Dされたファイルを受け取る
  export const handleFileDrop = (event: DragEvent) => {
    event.preventDefault();

    const file = event.dataTransfer?.files[0];
    if (file) {
      videoWrapperEl?.loadFile(file);
    }
  };

  // ダイアログで選んだファイルを受け取る
  const handleFileOpen = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      videoWrapperEl?.loadFile(file);
    }
  };

  // Youtubeの動画URLを検証して開く
  const handleYoutubeOpen = async (event: Event) => {
    const url = youtubeUrlText.trim();
    if (url === "") return;
    const id = extractYoutubeVideoId(url);
    if (id === undefined) return;

    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
    if (response.ok) {
      videoWrapperEl?.openYoutubeVideo(id);
    }
  };

  function extractYoutubeVideoId(url: string) {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
    return match ? match[1] : undefined;
  }

  // シークバーの処理
  const handleLoaded = () => {
    showSplash = false;
    isLoaded = true;
    duration = videoWrapperEl?.getDuration() || 0;
    handleVolumeUpdate(volume);
    handleSpeedUpdate(speed);
    const paused = videoWrapperEl?.getPaused();
    if (paused !== undefined) {
      playButtonText = paused ? "play" : "pause";
    }
  };

  // シークバーの処理
  const handlePlayButton = () => {
    videoWrapperEl?.toggle();
    const paused = videoWrapperEl?.getPaused();
    if (paused !== undefined) {
      playButtonText = paused ? "play" : "pause";
    }
  };

  // シークバーの処理
  const handleSeeked = (value: number) => {
    videoWrapperEl?.setTime(value);
  };

  const handleTimeUpdate = (value: number) => {
    seekBarEl?.setProgress(value);
    duration = videoWrapperEl?.getDuration() || 0;
  }

  const handleVolumeUpdate = (value: number) => {
    videoWrapperEl?.setVolume(value);
  }

  const handleSpeedUpdate = (value: number) => {
    videoWrapperEl?.setSpeed(value);
  }
</script>

<div class="tw:size-full tw:relative">
  <!--hidden input-->
  <input type="file" accept="video/*" class="tw:hidden" bind:this={fileInputEl} onchange={handleFileOpen}>

  <!--video player-->
  <div class="tw:size-full tw:flex tw:flex-col">
    <div class="tw:w-full tw:grow tw:min-h-0">
      <VideoWrapper bind:this={videoWrapperEl} onload={handleLoaded} ontimeupdate={handleTimeUpdate}></VideoWrapper>
    </div>
    <div class="tw:w-full tw:h-5 tw:flex" style:visibility={isLoaded ? "visible" : "hidden"}>
      <button 
        class="seekbar-side-button tw:w-9 tw:relative"
        onmouseenter={() => {showSpeedSlider = true;}}
        onmouseleave={() => {showSpeedSlider = false;}}
      >
        <SpeedIcon size={14} color="var(--tw-color-p200)"></SpeedIcon>
        {#if showSpeedSlider}
          <div class="vertical-slider-container">
            <div>{speed}</div>
            <div class="tw:h-40">
              <VerticalSlider min={0.4} max={1.6} step={0.05} bind:value={speed} onchange={handleSpeedUpdate}></VerticalSlider>
            </div>
          </div>
        {/if}
      </button>
      <button 
        class="seekbar-side-button tw:w-9 tw:relative"
        onmouseenter={() => {showVolumeSlider = true;}}
        onmouseleave={() => {showVolumeSlider = false;}}
      >
        <VolumeIcon size={14} color="var(--tw-color-p200)"></VolumeIcon>
        {#if showVolumeSlider}
          <div class="vertical-slider-container">
            <div>{volume}</div>
            <div class="tw:h-30">
              <VerticalSlider min={0} max={100} step={1} bind:value={volume} onchange={handleVolumeUpdate}></VerticalSlider>
            </div>
          </div>
        {/if}
      </button>
      <button class="seekbar-side-button tw:cursor-pointer tw:w-16"
              onclick={handlePlayButton}>
        <span>{playButtonText}</span>
      </button>
      <SeekBar bind:this={seekBarEl} duration={duration} onseeked={handleSeeked}></SeekBar>
    </div>
  </div>

  <!--splash text-->
  <div class="tw:absolute tw:inset-0 tw:m-auto tw:size-fit tw:p-10
              tw:border tw:rounded-xl tw:border-p600 tw:border-dashed
              tw:flex tw:flex-col tw:items-center tw:justify-center
            tw:text-p400"
       style:visibility={showSplash ? "visible" : "hidden"}>
    <ul class="tw:list-disc tw:list-inside">
      <li>
        動画ファイルをドロップ （もしくは 
        <button class="textlink-button" onclick={() => fileInputEl.click()}>選択</button>
        ）
      </li>
      <li>
        YouTubeの動画リンクを入力<br>
        <div class="tw:inline-flex tw:items-center tw:gap-2 tw:pl-5">
          <input type="text" class="tw:bg-p800 tw:text-sm" placeholder="https://..." bind:value={youtubeUrlText}> 
          <button class="textlink-button" onclick={handleYoutubeOpen}>Go</button>
        </div>
      </li>
    </ul>
  </div>
</div>

<style>
.textlink-button {
  background: none;
  border: none;
  padding: 0;
  font: inherit;

  color: #b8c4ff;
  text-decoration: underline;
  cursor: pointer;
}

.textlink-button:hover {
  color: #6982ff;
}

@reference "../app.css";

.seekbar-side-button {
  @apply tw:grid tw:place-items-center
         tw:bg-p700 tw:hover:bg-p800 tw:text-xs tw:text-p200 
         tw:inset-shadow-[0_0_0.5rem] tw:inset-shadow-p900 tw:select-none;
}

.seekbar-side-button > span {
  @apply tw:whitespace-nowrap tw:-translate-y-1/9;
}

.vertical-slider-container {
  @apply tw:absolute tw:p-0.5 tw:bg-p800 tw:bottom-full
         tw:flex tw:flex-col tw:w-[70%] tw:items-center;
}

.vertical-slider-container > :nth-child(1) {
  @apply tw:absolute tw:bottom-full tw:left-1/2 tw:-translate-x-1/2 tw:text-xs;
}

.vertical-slider-container > :nth-child(2) {
  @apply tw:grow tw:w-[40%];
}
</style>