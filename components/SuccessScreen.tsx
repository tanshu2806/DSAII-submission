'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface SuccessScreenProps {
  onReset: () => void;
}

export function SuccessScreen({ onReset }: SuccessScreenProps) {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      className="w-full max-w-md flex flex-col items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        variants={itemVariants}
        className="w-24 h-24 rounded-full bg-green-950 border-2 border-green-500 flex items-center justify-center mb-6"
      >
        <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </motion.div>

      <motion.div variants={itemVariants} className="text-center mb-8">
        <h2 className="text-3xl font-bold text-zinc-50 mb-3">Payment Received!</h2>
        <p className="text-zinc-400 mb-2">
          Thank you for your submission. We have received your payment screenshot and details.
        </p>
        <p className="text-zinc-500 text-sm">
          A confirmation email will be sent to you shortly.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-lg mb-8"
      >
        <h3 className="text-zinc-400 font-semibold mb-3">What happens next?</h3>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li className="flex gap-2">
            <span className="text-green-500">✓</span>
            <span>Your details have been saved securely</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-500">✓</span>
            <span>Payment screenshot has been stored</span>
          </li>
          <li className="flex gap-2">
            <span className="text-green-500">✓</span>
            <span>Your order is being processed</span>
          </li>
        </ul>
      </motion.div>

      <motion.div variants={itemVariants} className="w-full">
        <Button
          onClick={onReset}
          className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 font-semibold h-12 rounded-lg transition-colors"
        >
          Submit Another Form
        </Button>
      </motion.div>
    </motion.div>
  );
}
