import styles from "./Configuration.module.css";

export default function EnergyScheduling({ values, onEnteredValues }) {
  const formulations = [
    { value: "fbs", label: "Foward Backward Sweep (Linearization)" },
    { value: "bfm_polar", label: "Branch Flow Model (Exact)" },
    { value: "bim_polar", label: "Bus Injection Model (Exact)" },
  ];
  const kVA_bases = [1, 10, 100];

  return (
    <div className={styles.row}>
      <p>
        <label htmlFor="dropdown">Optimization Formulation</label>
        <select
          id="formulation"
          value={values.formulation}
          onChange={(event) =>
            onEnteredValues("formulation", event.target.value)
          }
        >
          {formulations.map((form) => (
            <option key={form.value} value={form.value}>
              {form.label}
            </option>
          ))}
        </select>
      </p>
      <p>
        <label htmlFor="dropdown">kVA_base</label>
        <select
          id="kVA_base"
          value={values.kVA_base}
          onChange={(event) => onEnteredValues("kVA_base", event.target.value)}
        >
          {kVA_bases.map((kVA_base) => (
            <option key={kVA_base} value={kVA_base}>
              {kVA_base}
            </option>
          ))}
        </select>
      </p>
    </div>
  );
}
