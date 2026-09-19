import { StatStatus, StatType } from '../types';

export interface RuleEvaluation {
  status: StatStatus;
  reason: string;
}

/**
 * Evaluates a single health entry deterministically using standard medical reference ranges.
 */
export function evaluateHealthStat(
  type: StatType,
  value1: number,
  value2?: number
): RuleEvaluation {
  if (type === 'bp') {
    const systolic = value1;
    const diastolic = value2 || 80;

    // Hypertensive Crisis / Severe
    if (systolic >= 180 || diastolic >= 120) {
      return {
        status: 'Abnormal',
        reason: `Systolic ${systolic} or Diastolic ${diastolic} is critically elevated (Hypertensive Crisis).`
      };
    }
    // High Blood Pressure Stage 2 or Stage 1
    if (systolic >= 140 || diastolic >= 90) {
      return {
        status: 'Abnormal',
        reason: `Reading (${systolic}/${diastolic} mmHg) is in High Blood Pressure Stage 2 range.`
      };
    }
    if (systolic >= 130 || diastolic >= 80) {
      return {
        status: 'Borderline',
        reason: `Reading (${systolic}/${diastolic} mmHg) is in High Blood Pressure Stage 1 / Elevated range.`
      };
    }
    if (systolic >= 120 && diastolic < 80) {
      return {
        status: 'Borderline',
        reason: `Systolic (${systolic} mmHg) is slightly elevated above normal (120 mmHg).`
      };
    }
    // Low BP
    if (systolic < 90 || diastolic < 60) {
      return {
        status: 'Borderline',
        reason: `Reading (${systolic}/${diastolic} mmHg) is lower than typical target (90/60 mmHg).`
      };
    }
    return {
      status: 'Normal',
      reason: `Reading (${systolic}/${diastolic} mmHg) is within healthy optimal range (<120/<80 mmHg).`
    };
  }

  if (type === 'glucose') {
    const glucose = value1; // Fasting / random mg/dL
    if (glucose < 70) {
      return {
        status: 'Abnormal',
        reason: `Blood sugar (${glucose} mg/dL) is low (Hypoglycemia < 70 mg/dL).`
      };
    }
    if (glucose >= 200) {
      return {
        status: 'Abnormal',
        reason: `Blood sugar (${glucose} mg/dL) is significantly high (Severe Hyperglycemia).`
      };
    }
    if (glucose >= 126) {
      return {
        status: 'Abnormal',
        reason: `Fasting sugar (${glucose} mg/dL) is elevated above diabetic threshold (126 mg/dL).`
      };
    }
    if (glucose >= 100) {
      return {
        status: 'Borderline',
        reason: `Fasting sugar (${glucose} mg/dL) is in pre-diabetic range (100–125 mg/dL).`
      };
    }
    return {
      status: 'Normal',
      reason: `Blood sugar (${glucose} mg/dL) is in standard normal range (70–99 mg/dL).`
    };
  }

  if (type === 'temperature') {
    const temp = value1; // °F
    if (temp >= 102) {
      return {
        status: 'Abnormal',
        reason: `Body temperature (${temp.toFixed(1)}°F) indicates a high fever (≥102°F).`
      };
    }
    if (temp >= 99.5) {
      return {
        status: 'Borderline',
        reason: `Body temperature (${temp.toFixed(1)}°F) indicates a mild fever/low-grade temperature.`
      };
    }
    if (temp < 95.0) {
      return {
        status: 'Abnormal',
        reason: `Body temperature (${temp.toFixed(1)}°F) is abnormally low (Hypothermia <95°F).`
      };
    }
    return {
      status: 'Normal',
      reason: `Body temperature (${temp.toFixed(1)}°F) is within normal range (97.8°F – 99.1°F).`
    };
  }

  return { status: 'Normal', reason: 'Value is within acceptable boundaries.' };
}
