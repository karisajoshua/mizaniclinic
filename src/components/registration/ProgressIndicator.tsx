
import { CheckCircle } from "lucide-react";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: { number: number; label: string; completed?: boolean }[];
}

const ProgressIndicator = ({ currentStep, totalSteps, steps }: ProgressIndicatorProps) => {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.completed || step.number === currentStep 
                  ? 'bg-tanzania-green' 
                  : 'bg-tanzania-grey'
              }`}>
                {step.completed ? (
                  <CheckCircle className="w-4 h-4 text-white" />
                ) : (
                  <span className={`text-sm font-bold ${
                    step.number === currentStep ? 'text-white' : 'text-tanzania-text'
                  }`}>
                    {step.number}
                  </span>
                )}
              </div>
              <span className={`font-medium ${
                step.completed || step.number === currentStep
                  ? 'text-tanzania-green'
                  : 'text-tanzania-text/60'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 bg-tanzania-grey mx-4 rounded-full">
                <div className={`h-1 rounded-full ${
                  step.completed ? 'bg-tanzania-green w-full' : 'bg-tanzania-green w-1/2'
                }`}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
