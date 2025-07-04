import React from 'react';
import { Lock, Crown, Zap } from 'lucide-react';

interface FeatureGateProps {
  feature: string;
  requiredTier: 'pro' | 'enterprise';
  currentTier: 'free' | 'pro' | 'enterprise';
  children: React.ReactNode;
  onUpgrade?: () => void;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  requiredTier,
  currentTier,
  children,
  onUpgrade,
}) => {
  const hasAccess = () => {
    if (requiredTier === 'pro') {
      return currentTier === 'pro' || currentTier === 'enterprise';
    }
    if (requiredTier === 'enterprise') {
      return currentTier === 'enterprise';
    }
    return true;
  };

  if (hasAccess()) {
    return <>{children}</>;
  }

  const getIcon = () => {
    switch (requiredTier) {
      case 'pro':
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 'enterprise':
        return <Zap className="w-6 h-6 text-purple-500" />;
      default:
        return <Lock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTierColor = () => {
    switch (requiredTier) {
      case 'pro':
        return 'border-yellow-200 bg-yellow-50';
      case 'enterprise':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={`relative border-2 border-dashed rounded-lg p-8 text-center ${getTierColor()}`}>
      <div className="absolute inset-0 bg-white bg-opacity-75 rounded-lg"></div>
      <div className="relative z-10">
        {getIcon()}
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {feature} - {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} Feature
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Upgrade to {requiredTier} to unlock this feature and get more insights for your business.
        </p>
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors ${
              requiredTier === 'pro'
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-purple-500 hover:bg-purple-600 text-white'
            }`}
          >
            Upgrade to {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)}
          </button>
        )}
      </div>
    </div>
  );
};