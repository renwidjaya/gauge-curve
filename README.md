```
import GaugeCurve from 'gauge-curve';

// Gunakan GaugeCurve dalam kode Anda
const ExampleComponent = () => {
  return (
    <GaugeCurve
      value={50}
      gaugeColor="#ff0000"
      gaugeValueColor={['#9EC6FF', '#0600C2', '#BC005A']}
      gaugeStroke={2}
      gaugeValueStroke={3}
      insideTextColor="#0000ff"
      size={200}
    />
  );
};

export default ExampleComponent;
```
