const generateHTML = (user) => {
  return `
  <html>
  <head>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
      }

      .container {
        display: flex;
        width: 100%;
      }

      /* LEFT SIDE */
      .left {
        height:auto
        width: 30%;
        background: #2c3e50;
        color: white;
        padding: 20px;
      }

      .left h1 {
        margin-bottom: 5px;
      }

      .section {
        margin-top: 20px;
      }

      .section h3 {
        border-bottom: 1px solid #ccc;
        padding-bottom: 5px;
      }

      /* RIGHT SIDE */
      .right {
        width: 70%;
        padding: 30px;
      }

      .right h2 {
        border-bottom: 2px solid #2c3e50;
        padding-bottom: 5px;
      }

      .item {
        margin-bottom: 15px;
      }

      .tech {
        font-size: 12px;
        color: gray;
      }

    </style>
  </head>

  <body>

    <div class="container">

      <!-- LEFT -->
      <div class="left">

        <h1>${user.name}</h1>
        <p>${user.jobTitle}</p>

        <div class="section">
          <h3>CONTACT</h3>
          <p>${user.phone}</p>
          <p>${user.email}</p>
          <p>${user.location}</p>
          <p>${user.website || ""}</p>
        </div>

        <div class="section">
          <h3>SKILLS</h3>
          ${
            user.skills && user.skills.length
              ? user.skills.map(skill => `<p>${skill}</p>`).join("")
              : "<p>No skills added</p>"
          }
        </div>

      </div>

      <!-- RIGHT -->
      <div class="right">

        <h2>ABOUT ME</h2>
        <p>${user.bio || "N/A"}</p>

        <h2>EDUCATION</h2>
        ${
          user.education?.map(edu => `
            <div class="item">
              <strong>${edu.degree}</strong><br/>
              ${edu.institution} (${edu.startYear} - ${edu.endYear})<br/>
              ${edu.marks ? `<span>Marks: ${edu.marks}</span>` : ""}
            </div>
          `).join("") || "<p>N/A</p>"
        }

        <h2>WORK EXPERIENCE</h2>
        ${
          user.experience?.map(exp => `
            <div class="item">
              <strong>${exp.title}</strong><br/>
              ${exp.company} (${exp.startDate} - ${exp.endDate})
              <p>${exp.description}</p>
            </div>
          `).join("") || "<p>N/A</p>"
        }

        <h2>PROJECTS</h2>
        ${
          user.projects?.map(proj => `
            <div class="item">
              <strong>${proj.title}</strong>
              <p>${proj.description}</p>
              <div class="tech">
                Tech: ${proj.techStack?.join(", ")}
              </div>
            </div>
          `).join("") || "<p>N/A</p>"
        }

      </div>

    </div>

  </body>
  </html>
  `;
};

module.exports = generateHTML;