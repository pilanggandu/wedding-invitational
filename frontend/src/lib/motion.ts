export const MOTION_TRANSITIONS = {
  romantic: {
    duration: 0.72,
    ease: [0.22, 1, 0.36, 1] as const,
  },
  opening: {
    duration: 0.88,
    ease: [0.22, 1, 0.36, 1] as const,
  },
  gentle: {
    duration: 0.55,
    ease: [0.25, 0.1, 0.25, 1] as const,
  },
  micro: {
    duration: 0.22,
    ease: [0.16, 1, 0.3, 1] as const,
  },
  float: {
    duration: 5.6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
} as const;

export const MOTION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: MOTION_TRANSITIONS.romantic,
    },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: MOTION_TRANSITIONS.romantic,
    },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: MOTION_TRANSITIONS.romantic,
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: MOTION_TRANSITIONS.romantic,
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: 16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: MOTION_TRANSITIONS.romantic,
    },
  },
  cardLift: {
    hidden: { opacity: 0, y: 14, scale: 0.985 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: MOTION_TRANSITIONS.romantic,
    },
  },
  pop: {
    hidden: { opacity: 0, scale: 0.94, y: 8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: MOTION_TRANSITIONS.gentle,
    },
  },
  stamp: {
    hidden: { opacity: 0, scale: 1.05, y: -8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: MOTION_TRANSITIONS.gentle,
    },
  },
  frameMount: {
    hidden: { opacity: 0, scale: 1.08, y: -36, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.95,
        ease: [0.2, 0.9, 0.3, 1],
      },
    },
  },
} as const;

export const STAGGER_CONTAINER = (stagger = 0.08, delayChildren = 0.04) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});
