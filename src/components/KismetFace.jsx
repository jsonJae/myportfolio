import { useEffect, useId, useRef } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/*
  Kismet, a split-face tortoiseshell cat inside an Ultramarine ink disc, the
  same circle as the dock's buttons. Every shape is rounded: soft ears, round
  amber eyes, a soft nose, curved whiskers.

  A faint second Ultramarine plate sits behind the disc. It drifts out of
  register while Kismet thinks and snaps back the moment it starts answering.

  state: 'idle' | 'thinking' | 'talking' | 'error'
  talkPulse: changes whenever a new chunk of text arrives; each change opens
             the mouth for a beat, so Kismet "speaks" with the stream.
  happy:   hover: eyes close into content arcs, ears perk.
  track:   pupils follow the pointer.
  still:   no idle motion; for small inline avatars.
  lookAt:  { x, y } in viewBox units; overrides pointer tracking while set.
  lifted:  hover: the second plate slides out from under the disc, like a
           sticker lifting off the page.
*/

const FUR = {
  dark: '#33251E',
  ginger: '#DE8638',
  caramel: '#B5642C',
  muzzle: '#F2CB98',
  innerEar: '#E59C7E',
  nose: '#D7796C',
  ink: '#1E1511',
  cream: '#FCEEDC',
  iris: '#F0BF48',
  tongue: '#8A3530',
};

// ":3" mouth hanging from the nose. Same command structure in every shape so
// the path morphs cleanly.
const MOUTH = {
  smile: 'M24 34.3 Q24 36.4 21.8 36.2 M24 34.3 Q24 36.4 26.2 36.2',
  happy: 'M24 34.3 Q24 37 21.4 36.6 M24 34.3 Q24 37 26.6 36.6',
  hmm: 'M24 34.3 Q24 35.8 22 35.8 M24 34.3 Q24 35.4 26.2 35.4',
  flat: 'M24 34.3 Q24 35.6 21.6 35.6 M24 34.3 Q24 35.6 26.4 35.6',
};

const EAR_L = 'M8.4 24 C7.2 16 8 9.8 11 8.6 C13.6 7.6 17.8 11.2 21.4 16 Z';
const EAR_R = 'M39.6 24 C40.8 16 40 9.8 37 8.6 C34.4 7.6 30.2 11.2 26.6 16 Z';
const EAR_L_IN = 'M10.8 20.4 C10.4 15.6 11 12.4 12.4 11.8 C13.7 11.3 16.1 13.5 17.9 16.2 Z';
const EAR_R_IN = 'M37.2 20.4 C37.6 15.6 37 12.4 35.6 11.8 C34.3 11.3 31.9 13.5 30.1 16.2 Z';

// Eyes sit on opposite fur colours, so each one carries its own contrast colour
// for the closed "content" arc.
const EYES = [
  { side: 'l', cx: 18.2, arc: FUR.cream },
  { side: 'r', cx: 29.8, arc: FUR.ink },
];
const EYE_Y = 27.6;
const IRIS_R = 3;

const REGISTER = { type: 'spring', stiffness: 520, damping: 22 };
const EAR_SPRING = { type: 'spring', stiffness: 300, damping: 18 };
const BOX = { transformBox: 'fill-box' };

export default function KismetFace({ size = 46, state = 'idle', talkPulse, happy = false, track = true, still = false, lookAt = null, lifted = false, className = '' }) {
  // `still` (small inline avatars) behaves like reduced motion: expressions
  // change, but nothing loops, blinks or tracks.
  const reduced = useReducedMotion() || still;
  const uid = useId().replace(/:/g, '');
  const rootRef = useRef(null);
  const eyesRef = useRef(null);
  const earLRef = useRef(null);
  const earRRef = useRef(null);
  const jawRef = useRef(null);
  const talking = useRef(false);

  const thinking = state === 'thinking';
  const error = state === 'error';
  const content = happy && !thinking && !error;
  const following = track && !reduced && !thinking;

  // Pointer tracking, softened by springs so the pupils glide.
  const lookX = useMotionValue(0);
  const lookY = useMotionValue(0);
  const pupilX = useSpring(lookX, { stiffness: 200, damping: 20, mass: 0.5 });
  const pupilY = useSpring(lookY, { stiffness: 200, damping: 20, mass: 0.5 });

  useEffect(() => {
    // A deliberate glance (e.g. toward the direction of scroll) wins briefly.
    if (lookAt && !reduced) {
      lookX.set(lookAt.x);
      lookY.set(lookAt.y);
      return;
    }
    if (!following) {
      lookX.set(thinking && !reduced ? 0.7 : 0);
      lookY.set(thinking && !reduced ? -0.8 : 0);
      return;
    }
    let frame = 0;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = rootRef.current?.getBoundingClientRect();
        if (!r) return;
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, dist / 260);
        lookX.set((dx / dist) * reach * 1.2);
        lookY.set((dy / dist) * reach * 0.7);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
    };
  }, [following, thinking, reduced, lookX, lookY, lookAt]);

  // Slow, irregular blinks, sometimes a double blink.
  useEffect(() => {
    if (reduced || error) return;
    let timer;
    let live = true;
    const blink = async () => {
      const el = eyesRef.current;
      if (!el || !live) return;
      await animate(el, { scaleY: [1, 0.08, 1] }, { duration: 0.18, ease: 'easeInOut' });
      if (live && Math.random() < 0.2) {
        await animate(el, { scaleY: [1, 0.08, 1] }, { duration: 0.15, delay: 0.1, ease: 'easeInOut' });
      }
      if (live) timer = setTimeout(blink, 2800 + Math.random() * 3800);
    };
    timer = setTimeout(blink, 1400 + Math.random() * 2000);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [reduced, error]);

  // Ear twitches: now and then at rest, more often while thinking.
  useEffect(() => {
    if (reduced || error) return;
    let timer;
    let live = true;
    const twitch = async () => {
      if (!live) return;
      const left = Math.random() < 0.5;
      const el = left ? earLRef.current : earRRef.current;
      if (el) await animate(el, { rotate: [0, left ? -14 : 14, 0] }, { duration: 0.3, ease: 'easeOut' });
      if (live) timer = setTimeout(twitch, thinking ? 900 + Math.random() * 900 : 4500 + Math.random() * 5000);
    };
    timer = setTimeout(twitch, thinking ? 400 : 3000 + Math.random() * 3000);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [reduced, error, thinking]);

  // Speak with the stream: each new chunk drops the jaw for a beat.
  useEffect(() => {
    if (reduced || state !== 'talking' || talking.current) return;
    const el = jawRef.current;
    if (!el) return;
    talking.current = true;
    animate(el, { scaleY: [0, 1, 0] }, { duration: 0.2, ease: 'easeOut' }).then(() => {
      talking.current = false;
    });
  }, [talkPulse, state, reduced]);

  const mouth = error ? MOUTH.flat : thinking ? MOUTH.hmm : content ? MOUTH.happy : MOUTH.smile;
  // Ears flatten when something went wrong and perk on hover.
  const earTilt = error ? 22 : happy ? -5 : 0;
  // Narrow pupils at rest; round and curious while thinking.
  const pupilScale = thinking ? 1.75 : 1;

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      className={`block shrink-0 overflow-visible ${className}`}
    >
      <defs>
        <clipPath id={`${uid}-disc`}>
          <circle cx="24" cy="24" r="23" />
        </clipPath>
        <clipPath id={`${uid}-head`}>
          <circle cx="24" cy="31" r="17" />
        </clipPath>
        {EYES.map(({ side, cx }) => (
          <clipPath key={side} id={`${uid}-${side}`}>
            <circle cx={cx} cy={EYE_Y} r={IRIS_R} />
          </clipPath>
        ))}
      </defs>

      {/* Second plate: out of register while thinking */}
      <motion.circle
        cx="24"
        cy="24"
        r="23"
        className="fill-primary/25"
        initial={false}
        animate={
          thinking && !reduced
            ? { x: [2.2, -1.6, 1.2, 2.2], y: [-1.6, 1.4, 1.8, -1.6], transition: { duration: 2.2, ease: 'easeInOut', repeat: Infinity } }
            : lifted
              ? { x: -2.6, y: 2.8, transition: reduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 20 } }
              : { x: 0, y: 0, transition: reduced ? { duration: 0 } : REGISTER }
        }
      />

      {/* Key plate: the ink disc, with the cat inside it */}
      <circle cx="24" cy="24" r="23" className="fill-primary" />

      <g clipPath={`url(#${uid}-disc)`}>
        {/* Ears (behind the head) */}
        <motion.g
          ref={earLRef}
          style={{ ...BOX, transformOrigin: '80% 100%' }}
          initial={false}
          animate={{ rotate: -earTilt }}
          transition={EAR_SPRING}
        >
          <path d={EAR_L} fill={FUR.dark} />
          <path d={EAR_L_IN} fill={FUR.innerEar} fillOpacity="0.8" />
        </motion.g>
        <motion.g
          ref={earRRef}
          style={{ ...BOX, transformOrigin: '20% 100%' }}
          initial={false}
          animate={{ rotate: earTilt }}
          transition={EAR_SPRING}
        >
          <path d={EAR_R} fill={FUR.ginger} />
          <path d={EAR_R_IN} fill={FUR.innerEar} fillOpacity="0.8" />
        </motion.g>

        {/* Head: split-face tortoiseshell */}
        <circle cx="24" cy="31" r="17" fill={FUR.ginger} />
        <g clipPath={`url(#${uid}-head)`}>
          <path
            d="M0 10 H23.4 C25.8 15.6 22.2 20.4 24.8 25 C26.6 28.4 22.8 31 23.6 34 C24.8 38.4 21.4 42.6 23.4 48 H0 Z"
            fill={FUR.dark}
          />
          {/* Mottling: a few soft flecks of each colour on the other side */}
          <ellipse cx="31.6" cy="18.6" rx="4.6" ry="2.9" transform="rotate(-18 31.6 18.6)" fill={FUR.dark} />
          <ellipse cx="36.4" cy="27.4" rx="2.2" ry="1.6" fill={FUR.caramel} />
          <circle cx="34.6" cy="34.2" r="1.1" fill={FUR.dark} />
          <circle cx="31" cy="40.2" r="0.9" fill={FUR.dark} />
          <ellipse cx="13.4" cy="36.2" rx="3.6" ry="2.4" transform="rotate(12 13.4 36.2)" fill={FUR.caramel} />
          <circle cx="16.4" cy="19.8" r="1.1" fill={FUR.ginger} />
          <circle cx="11.4" cy="29" r="0.9" fill={FUR.caramel} />
          {/* Pale muzzle */}
          <ellipse cx="24" cy="35.8" rx="6" ry="4.5" fill={FUR.muzzle} />
        </g>

        {/* Whiskers: soft curves, they flick while talking */}
        <motion.g
          fill="none"
          stroke={FUR.cream}
          strokeOpacity="0.9"
          strokeWidth="0.9"
          strokeLinecap="round"
          initial={false}
          animate={state === 'talking' && !reduced ? { y: [0, -0.5, 0], transition: { duration: 0.5, repeat: Infinity } } : { y: 0 }}
        >
          <path d="M18.2 35.2 Q14 34.2 10.4 35.2" />
          <path d="M18.4 37 Q14.4 37.4 11.2 39.2" />
          <path d="M29.8 35.2 Q34 34.2 37.6 35.2" />
          <path d="M29.6 37 Q33.6 37.4 36.8 39.2" />
        </motion.g>

        {/* Eyes: round amber irises, soft oval pupils */}
        <motion.g
          initial={false}
          animate={{ y: error ? 0.7 : 0, scaleY: content ? 0.06 : 1, opacity: content ? 0 : 1 }}
          style={{ ...BOX, transformOrigin: 'center' }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.g ref={eyesRef} style={{ ...BOX, transformOrigin: 'center' }}>
            {EYES.map(({ side, cx }) => (
              <g key={side}>
                <circle cx={cx} cy={EYE_Y} r={IRIS_R} fill={FUR.iris} stroke={FUR.ink} strokeWidth="0.6" />
                <g clipPath={`url(#${uid}-${side})`}>
                  <motion.g style={{ x: pupilX, y: pupilY }}>
                    <motion.ellipse
                      cx={cx}
                      cy={EYE_Y}
                      rx="1.05"
                      ry="2.15"
                      fill={FUR.ink}
                      style={{ ...BOX, transformOrigin: 'center' }}
                      initial={false}
                      animate={{ scaleX: pupilScale }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    />
                  </motion.g>
                </g>
                <circle cx={cx - 1} cy={EYE_Y - 1.1} r="0.7" fill="#fff" />
              </g>
            ))}
          </motion.g>
        </motion.g>

        {/* Content: eyes close into soft upward arcs */}
        <motion.g
          fill="none"
          strokeWidth="1.4"
          strokeLinecap="round"
          initial={false}
          animate={{ opacity: content ? 1 : 0, y: content ? 0 : 0.8 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {EYES.map(({ side, cx, arc }) => (
            <path key={side} d={`M${cx - 2.6} ${EYE_Y + 0.8} Q${cx} ${EYE_Y - 2.6} ${cx + 2.6} ${EYE_Y + 0.8}`} stroke={arc} />
          ))}
        </motion.g>

        {/* Nose, mouth and the jaw that opens with each streamed chunk */}
        <path d="M22.3 32.4 Q24 31.6 25.7 32.4 Q25.7 33.7 24 34.4 Q22.3 33.7 22.3 32.4 Z" fill={FUR.nose} />
        <motion.ellipse
          ref={jawRef}
          cx="24"
          cy="36.3"
          rx="1.5"
          ry="1.3"
          fill={FUR.tongue}
          style={{ ...BOX, transformOrigin: '50% 0%', scaleY: 0 }}
        />
        <motion.path
          initial={false}
          animate={{ d: mouth }}
          transition={{ duration: reduced ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          fill="none"
          stroke={FUR.ink}
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
