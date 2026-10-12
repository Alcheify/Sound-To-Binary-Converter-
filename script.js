 function drawWave(amp, n) {
      const wrap = document.getElementById("waveWrap");
      const canvas = document.getElementById("wave");
      const ctx = canvas.getContext("2d");

      wrap.style.display = "block";

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = w * dpr;
      canvas.height = h * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const mid = h / 2;
      const scale = h / 2 - 18;

      // Center line
      ctx.strokeStyle = "rgba(168,65,255,0.3)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, mid);
      ctx.lineTo(w, mid);
      ctx.stroke();

      // Purple sound wave
      ctx.strokeStyle = "#d580ff";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#d580ff";
      ctx.shadowBlur = 8;
      ctx.beginPath();

      for (let x = 0; x <= w; x++) {
        const y = mid -
          amp * Math.sin(2 * Math.PI * x / w) * scale;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.stroke();
      ctx.shadowBlur = 0;

      // Sample points
      ctx.fillStyle = "#ffffff";

      for (let i = 0; i < n; i++) {
        const x = (i / n) * w;
        const y = mid -
          amp * Math.sin(2 * Math.PI * i / n) * scale;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function convert() {
      const freq = Number(document.getElementById("freq").value);
      const amp = Number(document.getElementById("amp").value);
      const n = Number(document.getElementById("samples").value);
      const bits = Number(document.getElementById("bits").value);

      const err = document.getElementById("error");
      const facts = document.getElementById("facts");
      const tableArea = document.getElementById("tableArea");

      err.textContent = "";
      facts.innerHTML = "";
      tableArea.innerHTML = "";

      // Validate the input values
      if (
        document.getElementById("freq").value === "" ||
        document.getElementById("amp").value === "" ||
        document.getElementById("samples").value === "" ||
        document.getElementById("bits").value === "" ||
        !Number.isFinite(freq) ||
        !Number.isFinite(amp) ||
        !Number.isFinite(n) ||
        !Number.isFinite(bits) ||
        freq <= 0 ||
        amp < 0 || amp > 1 ||
        !Number.isInteger(n) || n < 1 || n > 1000 ||
        !Number.isInteger(bits) || bits < 1 || bits > 16
      ) {
        err.textContent =
          "Enter valid values: frequency > 0, amplitude 0–1, " +
          "samples 1–1000, and bits 1–16.";

        document.getElementById("waveWrap").style.display = "none";
        return;
      }

      const levels = 2 ** bits;
      const period = 1000 / freq;
      const wavelength = 343 / freq;

      const wavelengthText = wavelength >= 1
        ? wavelength.toFixed(2) + " m"
        : (wavelength * 100).toFixed(1) + " cm";

      // Display sound information
      facts.innerHTML =
        "<div class='fact'><div class='label'>Amplitude</div>" +
        "<div class='value'>" + amp + "</div></div>" +

        "<div class='fact'><div class='label'>Frequency</div>" +
        "<div class='value'>" + freq + " Hz</div></div>" +

        "<div class='fact'><div class='label'>Period</div>" +
        "<div class='value'>" + period.toFixed(2) + " ms</div></div>" +

        "<div class='fact'><div class='label'>Wavelength</div>" +
        "<div class='value'>" + wavelengthText + "</div></div>";

      // Create the binary conversion table
      let html =
        "<table><thead><tr>" +
        "<th>Sample #</th>" +
        "<th>Time (ms)</th>" +
        "<th>Amplitude</th>" +
        "<th>Level</th>" +
        "<th>Binary</th>" +
        "</tr></thead><tbody>";

      for (let i = 0; i < n; i++) {
        const time = i * period / n;
        const height = amp * Math.sin(2 * Math.PI * i / n);

        const level = Math.round(
          (height + 1) / 2 * (levels - 1)
        );

        const binary = level.toString(2).padStart(bits, "0");

        html +=
          "<tr><td>" + (i + 1) + "</td>" +
          "<td>" + time.toFixed(2) + "</td>" +
          "<td>" + height.toFixed(2) + "</td>" +
          "<td>" + level + "</td>" +
          "<td class='bin'>" + binary + "</td></tr>";
      }

           html += "</tbody></table>";

      html +=
        "<div class='fact total'><div class='label'>Total Bits</div>" +
        "<div class='value'>" + (n * bits) + " bits</div></div>";

      tableArea.innerHTML = html;

      // Draw the sound wave
      drawWave(amp, n);
    }

    document.getElementById("convert")
      .addEventListener("click", convert);