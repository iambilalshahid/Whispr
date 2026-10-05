import { motion, AnimatePresence } from "framer-motion";

export const AnimatedEye = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.g
            key="open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Eye shape */}
            <motion.path
              d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4 }}
            />

            {/* Pupil */}
            <motion.circle
              cx="12"
              cy="12"
              r="3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.25 }}
            />
          </motion.g>
        ) : (
          <motion.g
            key="closed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[
              "m15 18-.722-3.25",
              "M2 8a10.645 10.645 0 0 0 20 0",
              "m20 15-1.726-2.05",
              "m4 15 1.726-2.05",
              "m9 18 .722-3.25",
            ].map((d, i) => (
              <motion.path
                key={i}
                d={d}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.05, // stagger effect ✨
                }}
              />
            ))}
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
};
