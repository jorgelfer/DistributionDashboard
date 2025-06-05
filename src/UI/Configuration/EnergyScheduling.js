import styles from "./Configuration.module.css";

export default function EnergyScheduling({
  values,
  onEnteredValues,
  onSubmitted,
}) {
  const formulations = [
    { value: "fbs", label: "Foward Backward Sweep (Linearization)" },
    { value: "bfm_polar", label: "Branch Flow Model (Exact)" },
    { value: "bim_polar", label: "Bus Injection Model (Exact)" },
  ];

  function handleSubmit(event) {
    event.preventDefault();
    onSubmitted();
  }

  return (
    <main className={styles.main}>
      <form className={styles.form} onSubmit={handleSubmit}>
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
            <label htmlFor="text">kVA_base</label>
            <input
              id="kVA_base"
              type="text"
              name="kVA_base"
              onChange={(event) =>
                onEnteredValues("kVA_base", event.target.value)
              }
              value={values.kVA_base}
            />
          </p>
        </div>
        <p className={styles.actions}>
          <button className="login-button">Run qsts</button>
        </p>
      </form>
    </main>
  );
}
