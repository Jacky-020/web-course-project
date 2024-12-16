import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

// @ts-expect-error no types available
import MP4Box from 'mp4box';

interface Segment {
    start: number;
    end: number;
}

class AnimationHandler {
    #ctx: CanvasRenderingContext2D | null = null;
    #frames: ImageBitmap[] = [];

    #sectionSize = 3 * 25 + 15;
    #frameRate = 25;

    #day: Segment = {
        start: 0,
        end: this.#sectionSize,
    };

    #transition: Segment = {
        start: this.#sectionSize,
        end: this.#sectionSize * 2,
    };

    #night: Segment = {
        start: this.#sectionSize * 2,
        end: this.#sectionSize * 3,
    };

    #segments = [this.#day, this.#transition, this.#night];
    #segment = 0;
    #direction = 1;
    #frame = 0;
    #frameCache = -1;
    #changeDirection = false;

    #timestamp = 0;

    #running = false;
    #stop = false;

    constructor() {}

    init(canvas: HTMLCanvasElement, frames: ImageBitmap[]) {
        this.#ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;
        this.#frames = frames;
    }

    start() {
        if (this.#running || this.#stop || this.#ctx === null || this.#frames.length === 0) {
            return;
        }
        this.#running = true;
        requestAnimationFrame(this.#render.bind(this));
    }

    #render(timestamp: number) {
        if (!this.#running || this.#stop || this.#ctx === null || this.#frames.length === 0) {
            return;
        }
        requestAnimationFrame(this.#render.bind(this));
        if (this.#timestamp === 0) {
            this.#timestamp = timestamp;
        }
        const deltaFrames = Math.floor((timestamp - this.#timestamp) / (1000 / this.#frameRate));
        let frame = this.#frame + deltaFrames * this.#direction;
        // end is exlusive
        if (
            (frame >= this.#segments[this.#segment].end && this.#direction == 1) ||
            (this.#changeDirection && this.#direction === 1)
        ) {
            this.#direction = -1;
            if (this.#frame == -1) this.#frame = this.#frames.length - 1;
            this.#frame = this.#frameCache;
            this.#timestamp = timestamp;
            frame = this.#frame - 1;
            this.#changeDirection = false;
        }
        // start is inclusive
        else if (
            (frame < this.#segments[this.#segment].start && this.#direction == -1) ||
            (this.#changeDirection && this.#direction === -1)
        ) {
            this.#direction = 1;
            this.#frame = this.#frameCache;
            if (this.#frame == -1) this.#frame = 0;
            this.#timestamp = timestamp;
            frame = this.#frame + 1;
            this.#changeDirection = false;
        }

        if (this.#frameCache !== frame) {
            this.#ctx.canvas.width = this.#frames[frame].width;
            this.#ctx.canvas.height = this.#frames[frame].height;
            this.#ctx.drawImage(this.#frames[frame], 0, 0);
            this.#frameCache = frame;
        }
    }

    changeSegment(segment: 0 | 2) {
        if (this.#timestamp === 0) {
            if (segment === 0) {
                this.#direction = -1;
                this.#frame = this.#frames.length - 1;
            } else {
                this.#direction = 1;
                this.#frame = 0;
            }
        } else if (segment > this.#segment && this.#direction === -1) {
            this.#changeDirection = true;
        } else if (segment < this.#segment && this.#direction === 1) {
            this.#changeDirection = true;
        }

        this.#segment = segment;
    }

    stop() {
        this.#stop = true;
    }

    pause() {
        this.#running = !this.#running;
    }

    isRunning() {
        return this.#running;
    }
}

export type { AnimationHandler };

const Canvas: React.FC<{
    done: (handler: AnimationHandler) => void;
    style?: React.CSSProperties;
    className?: string;
}> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationHandlerRef = useRef<AnimationHandler | null>(null);

    useEffect(() => {
        const getFrames = async () => {
            const frames: ImageBitmap[] = [];
            const response = await fetch('/day-and-night.mp4');
            const arrayBuffer = await response.arrayBuffer();

            const decoder = new VideoDecoder({
                output: async (frame) => {
                    frames.push(await createImageBitmap(frame));
                    frame.close();
                },
                error: (e) => console.error(e),
            });

            const video = MP4Box.createFile();
            video.start();
            video.onError = (e: Error) => {
                console.log(e);
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            video.onReady = (info: any) => {
                const track = info.videoTracks[0];
                const stream = new MP4Box.DataStream(undefined, 0, MP4Box.DataStream.BIG_ENDIAN);
                video.getTrackById(track.id).mdia.minf.stbl.stsd.entries[0].avcC.write(stream);
                decoder.configure({
                    codec: track.codec,
                    codedHeight: track.video.height,
                    codedWidth: track.video.width,
                    description: new Uint8Array(stream.buffer, 8),
                });
                video.setExtractionOptions(track.id);
                video.start();
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            video.onSamples = function (_id: any, _user: any, samples: any) {
                for (const sample of samples) {
                    decoder.decode(
                        new EncodedVideoChunk({
                            type: sample.is_sync ? 'key' : 'delta',
                            timestamp: (1e6 * sample.cts) / sample.timescale,
                            duration: (1e6 * sample.duration) / sample.timescale,
                            data: sample.data,
                        }),
                    );
                }
            };

            // @ts-expect-error required for MP4Box
            arrayBuffer.fileStart = 0;
            video.appendBuffer(arrayBuffer);
            video.flush();
            await decoder.flush();
            return frames;
        };
        async function init() {
            if (animationHandlerRef.current === null) {
                animationHandlerRef.current = new AnimationHandler();
                animationHandlerRef.current.init(canvasRef.current as HTMLCanvasElement, await getFrames());
            }
            props.done(animationHandlerRef.current);
        }

        init();

        return () => {
            animationHandlerRef.current?.pause();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (animationHandlerRef.current !== null) {
            animationHandlerRef.current.start();
        }
    });

    return (
        <motion.canvas
            ref={canvasRef}
            style={props.style}
            className={props.className}
            width={1280}
            height={720}
        ></motion.canvas>
    );
};

export default Canvas;
