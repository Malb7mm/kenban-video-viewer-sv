<script lang="ts">
  import { onMount } from "svelte";

  let { paused = $bindable(true), onload, ontimeupdate, }: {
    paused?: boolean,
    onload?: () => void,
    ontimeupdate?: (time: number) => void,
  } = $props();

  let loadState: "Unloaded" | "Local" | "YouTube" = $state("Unloaded");
  let videoEl: HTMLVideoElement | undefined = $state(undefined);
  let videoSrc: string = $state("");
  let youtubeDivEl: HTMLDivElement | undefined = $state(undefined);
  let youtubePlayer: YT.Player | undefined = $state(undefined);
  let youtubeReady: boolean = $state(false);
  let youtubeCurrentId: string = $state("");
  let timeUpdateIntervalId: number | undefined = undefined;

  onMount(() => {
    const loadPlayer = () => {
      if (youtubeDivEl === undefined) return;

      youtubePlayer = new window.YT.Player(youtubeDivEl, {
        playerVars: {
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: () => { youtubeReady = true; },
          onStateChange: handleYoutubeStateChange,
        }
      });
    };

    if (window.YT && window.YT.Player) {
      loadPlayer();
    }
    else {
      window.onYouTubeIframeAPIReady = () => {
        loadPlayer();
      };

      if (!document.getElementById("youtube-api-script")) {
        const scriptEl = document.createElement("script");
        scriptEl.id = "youtube-api-script";
        scriptEl.src = "https://www.youtube.com/iframe_api";
        if (document.body.firstChild) document.body.insertBefore(scriptEl, document.body.firstChild);
      }
    }
  });

  const handleYoutubeStateChange = (e: YT.OnStateChangeEvent) => {
    if (youtubePlayer === undefined) return;
    paused = e.data === YT.PlayerState.PAUSED;
    if (e.data === YT.PlayerState.PLAYING && youtubePlayer.getVideoUrl() !== youtubeCurrentId) {
      youtubeCurrentId = youtubePlayer.getVideoUrl();
      youtubePlayer.pauseVideo();
      handleFileLoad();
    }
  }

  export const loadFile = (file: File) => {
    if (!file.type.startsWith("video/")) {
      return;
    }

    videoSrc = URL.createObjectURL(file);
    loadState = "Local";
  };

  export const openYoutubeVideo = (id: string) => {
    youtubePlayer?.loadVideoById(id);
    loadState = "YouTube";
    if (youtubeReady) handleFileLoad();
  };

  export const play = () => {
    if (loadState === "Local" && videoEl !== undefined) {
      videoEl.play();
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      youtubePlayer.playVideo();
    }
  };

  export const pause = () => {
    if (loadState === "Local" && videoEl !== undefined) {
      videoEl.pause();
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      youtubePlayer.pauseVideo();
    }
  };

  export const getPaused = () => {
    let result = undefined;
    if (loadState === "Local" && videoEl !== undefined) {
      result = videoEl.paused;
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      result = youtubePlayer.getPlayerState() === YT.PlayerState.PAUSED;
    }
    return result;
  };

  export const toggle = () => {
    if (loadState === "Local" && videoEl !== undefined) {
      if (videoEl.paused) {
        videoEl.play();
      }
      else {
        videoEl.pause();
      }
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      if (youtubePlayer.getPlayerState() === YT.PlayerState.PAUSED) {
        youtubePlayer.playVideo();
      }
      else {
        youtubePlayer.pauseVideo();
      }
    }
  };

  export const getDuration = () => {
    let result = 0;
    if (loadState === "Local" && videoEl !== undefined) {
      result = videoEl.duration || 0;
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      result = youtubePlayer.getDuration();
    }
    return result;
  };

  export const getTime = () => {
    let result = 0;
    if (loadState === "Local" && videoEl !== undefined) {
      result = videoEl.currentTime || 0;
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      result = youtubePlayer.getCurrentTime();
    }
    return result;
  };

  export const setTime = (time: number) => {
    if (loadState === "Local" && videoEl !== undefined) {
      videoEl.currentTime = time;
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      youtubePlayer.seekTo(time, true);
    }
  }

  export const getVolume = () => {
    let result = 0;
    if (loadState === "Local" && videoEl !== undefined) {
      result = videoEl.volume * 100 || 0;
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      result = youtubePlayer.getVolume();
    }
    return result;
  };

  export const setVolume = (volume: number) => {
    if (loadState === "Local" && videoEl !== undefined) {
      videoEl.volume = volume / 100;
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      youtubePlayer.setVolume(volume);
    }
  }
  
  export const getSpeed = () => {
    let result = 1;
    if (loadState === "Local" && videoEl !== undefined) {
      result = videoEl.playbackRate || 1;
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      result = youtubePlayer.getPlaybackRate();
    }
    return result;
  };

  export const setSpeed = (rate: number) => {
    if (loadState === "Local" && videoEl !== undefined) {
      videoEl.playbackRate = rate;
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      youtubePlayer.setPlaybackRate(rate);
    }
  };

  export const isPlaybackCompleted = () => {
    if (loadState === "Local" && videoEl !== undefined) {
      return videoEl.ended;
    }
    if (loadState === "YouTube" && youtubePlayer !== undefined) {
      return youtubePlayer.getPlayerState() === YT.PlayerState.ENDED;
    }
  };

  const handleFileLoad = () => {
    onload?.();

    clearInterval(timeUpdateIntervalId);
    timeUpdateIntervalId = setInterval(() => {
      if (loadState === "Local" && videoEl !== undefined) {
        ontimeupdate?.(videoEl.currentTime);
      }
      if (loadState === "YouTube" && youtubePlayer !== undefined) {
        ontimeupdate?.(youtubePlayer.getCurrentTime());
      }
    }, 100);
  };
</script>

<div class="tw:size-full tw:relative">
  <!-- svelte-ignore a11y_media_has_caption -->
  <div 
    class="tw:size-full tw:absolute tw:inset-0"
    style:visibility={ loadState === "Local" ? "visible" : "hidden" }
  >
    <video 
      class="tw:size-full tw:object-contain" 
      src={videoSrc}
      bind:this={videoEl}
      onloadedmetadata={() => { paused = true; handleFileLoad(); }}
      onplay={() => { paused = false; }}
      onpause={() => { paused = true; }}
      onended={() => { paused = true; }}
    ></video>
  </div>

  <div 
    class="tw:size-full tw:absolute tw:inset-0 youtube-iframe-container"
    style:visibility={ loadState === "YouTube" ? "visible" : "hidden" }
  >
    <div bind:this={youtubeDivEl}></div>
  </div>
</div>

<style>

:global(.youtube-iframe-container iframe) {
	aspect-ratio: 16 / 9;
	
	max-width: 100%;
	max-height: 100%;
	
	width: 100%;
	height: 100%;
}

.youtube-iframe-container * {
  pointer-events: none;
}
</style>