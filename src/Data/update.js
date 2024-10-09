import * as d3 from 'd3';

export function updateData(network, selectedValue, dateParser) {

    // buses uid
    const buses_uid = network.bus.map(d => d.uid)

    // initialize data container
    let data = []
    switch (selectedValue) {
        case "vm":
            // organize data
            network.bus.forEach((d, i) => {
                d["phases"].forEach((d2, i2) => {
                    data.push(d.vm[d2.toString()].map((d3, i3) =>({
                        "time": dateParser(network["time"][i3]),
                        "val": +d3 / (+d.kV_base * 1000),
                        "phase": d2.toString(),
                        "bus": d.uid,
                        "uid": d.uid + "." + d2.toString(),
                    })));
                })
            })
            // push lower limit 
            const vm_lb = 1 - (isNaN(network["ansi"]) ? 0.05 : +network["ansi"])
            network["time"].forEach((d, i) => {
                data.push({
                    "time": dateParser(d),
                    "val":  vm_lb,
                    "phase": "0",
                    "uid": "lb.0",
                });
            })
            // push upper limit 
            const vm_ub = 1 + (isNaN(network["ansi"]) ? 0.05 : +network["ansi"])
            network["time"].forEach((d, i) => {
                data.push({
                    "time": dateParser(d),
                    "val": vm_ub,
                    "phase": "4",
                    "uid": "ub.0",
                });
            })
            return [data, [vm_lb-0.05, vm_ub+0.05]];

        case "flow":  
            return [data, [0,0]];

        case "p_dr":   
            // organize data
            const dr_load = (network["dr_load"] || [])
            dr_load.forEach((d, i) => {
                if (buses_uid.includes(d.bus)) {
                    d["phases"].forEach((d2, i2) => {
                        data.push(d.p[d2.toString()].map((d3, i3) =>({
                            "time": dateParser(network["time"][i3]),
                            "p": +d3,
                            "s": +d3 / +d.pf,
                            "q": +Math.tan(Math.acos(d.pf)) * +d3,
                            "phase": d2.toString(),
                            "bus": d.bus,
                            "uid": d.uid + "." + d2.toString(),
                        })));
                    })
                }
            });
            return [data, [0, d3.max(data.flat().map(d=>d.p))]];

        case "p_d":   
            // organize data
            network["load"].forEach((d, i) => {
                if (buses_uid.includes(d.bus)) {
                    d["phases"].forEach((d2, i2) => {
                        data.push(d.p[d2.toString()].map((d3, i3) =>({
                            "time": dateParser(network["time"][i3]),
                            "p": +d3,
                            "q": d.q[d2.toString()][i3],
                            "s": Math.sqrt(Math.pow(+d3,2) + Math.pow(+d.q[d2.toString()][i3],2)),
                            "phase": d2.toString(),
                            "bus": d.bus,
                            "uid": d.uid + "." + d2.toString(),
                        })));
                    })
                }
            });
            return [data, [0, d3.max(data.flat().map(d=>d.p))]];

        case "p_g":   
            // organize data
            network["vsource"].forEach((d, i) => {
                if (buses_uid.includes(d.bus)) {
                    d["phases"].forEach((d2, i2) => {
                        data.push(d.p[d2.toString()].map((d3, i3) =>({
                            "time": dateParser(network["time"][i3]),
                            "p": +d3,
                            "q": +d.q[d2.toString()][i3],
                            "s": Math.sqrt(Math.pow(+d3,2) + Math.pow(+d.q[d2.toString()][i3],2)),
                            "phase": d2.toString(),
                            "bus": d.bus,
                            "uid": d.uid + "." + d2.toString(),
                        })));
                    })
                }
            })
            const flex_gen = (network["flex_gen"] || [])
            flex_gen.forEach((d, i) => {
                if (buses_uid.includes(d.bus)) {
                    d["phases"].forEach((d2, i2) => {
                        data.push(d.p[d2.toString()].map((d3, i3) =>({
                            "time": dateParser(network["time"][i3]),
                            "p": +d3,
                            "q": 0.0,
                            "s": +d3,
                            "phase": d2.toString(),
                            "bus": d.bus,
                            "uid": d.uid + "." + d2.toString(),
                        })));
                    })
                }
            })
            return [data, [0, d3.max(data.flat().map(d=>d.p))]];

        case "p_i":   
            // organize data
            network.bus.forEach((d, i) => {
                d["phases"].forEach((d2, i2) => {
                    if (d["p_i"] !== undefined) {
                        data.push(d.p_i[d2.toString()].map((d3, i3) =>({
                            "time": dateParser(network["time"][i3]),
                            "p": +d3,
                            "q": +d.q_i[d2.toString()][i3],
                            "s": Math.sqrt(Math.pow(+d3,2) + Math.pow(+d.q_i[d2.toString()][i3],2)),
                            "phase": d2.toString(),
                            "bus": d.bus,
                            "uid": d.uid + "." + d2.toString(),
                        })));
                    }
                })
            })

            // vertical scale
            if (data.length === 0) {
                return [data, [0,0]];
            } else {
                let min_p = d3.min(data.flat().map(d=>d.p))
                let min_q = d3.min(data.flat().map(d=>d.q))
                let max_p = d3.max(data.flat().map(d=>d.p))
                let max_q = d3.max(data.flat().map(d=>d.q))
                return [data, [d3.min([min_p, min_q]), d3.max([max_p, max_q])]];
            }

        case "soc":
            // organize data
            const battery = (network["battery"] || [])
            battery.forEach((d, i) => {
                if (buses_uid.includes(d.bus)) {
                    d["phases"].forEach((d2, i2) => {
                        data.push(d.soc[d2.toString()].map((d3, i3) =>({
                            "time": dateParser(network["time"][i3]),
                            "val": +d3,
                            "phase": d2.toString(),
                            "bus": d.bus,
                            "uid": d.uid + "." + d2.toString(),
                        })));
                    })
                }
            });

            return [data, [0, d3.max(data.flat().map(d=>d["val"]))]];

        default:  
            return [data, [0,0]];
    };

};