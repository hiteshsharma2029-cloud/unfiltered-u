import { useEffect, useState } from 'react';
import './Login.css';

const DOMAIN = '@chitkara.edu.in';
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

function isInStudentList(email, students) {
  const wanted = email.trim();

  return students.some(
    (student) =>
      student &&
      typeof student.email === 'string' &&
      student.email.trim() === wanted
  );
}

function checkNormalEmail(input) {
  const email = input.value.trim();

  if (email === '') return 'Enter your email';

  if (!/^[a-zA-Z]+\d+@gmail\.com$/i.test(email)) {
    return 'Enter a valid Gmail address, e.g. abc123@gmail.com';
  }

  return '';
}

function checkPersonalEmail(input) {
  if (input.value.trim() === '') return 'Enter your email';

  if (!/^[a-zA-Z]+\d+@gmail\.com$/i.test(input.value.trim())) {
    return 'Enter a valid Gmail address, e.g. abc123@gmail.com';
  }

  return '';
}

function checkUniversityEmail(input, students) {
  if (input.value.trim() === '') return 'Enter your university email';

  if (!input.checkValidity()) return 'Enter a valid university email';

  if (!input.value.trim().toLowerCase().endsWith(DOMAIN)) {
    return 'Use your @chitkara.edu.in email';
  }

  if (!isInStudentList(input.value, students)) {
    return 'Student email not recognized';
  }

  return '';
}

const EMPTY = {
  name: '',
  email: '',
  university: '',
  collegeEmail: '',
  personalEmail: '',
  semester: '',
};

export default function Login({ onContinue }) {
  const [mode, setMode] = useState('new');
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [loginResult, setLoginResult] = useState(null);

  const [students, setStudents] = useState([]);
  const [studentsLoaded, setStudentsLoaded] = useState(false);
  const [studentsLoadError, setStudentsLoadError] = useState(false);

  useEffect(() => {
    fetch('/students.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load student records');
        }

        return response.json();
      })
      .then((data) => {
        setStudents(Array.isArray(data.students) ? data.students : []);
        setStudentsLoaded(true);
        setStudentsLoadError(false);
      })
      .catch(() => {
        setStudentsLoaded(false);
        setStudentsLoadError(true);
      });
  }, []);

  const set = (key) => (e) => {
    setValues({ ...values, [key]: e.target.value });
    setErrors({ ...errors, [key]: '' });
  };

  const setEmail = (key, check) => (e) => {
    const input = e.target;

    setValues({ ...values, [key]: input.value });

    setErrors({
      ...errors,
      [key]: input.value.trim() === '' ? '' : check(input),
    });
  };

  const switchMode = (next) => {
    setMode(next);
    setErrors({});
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const newErrors = {};

    if (mode === 'new') {
      newErrors.email = checkNormalEmail(form.elements.email);
    } else {
      newErrors.collegeEmail = studentsLoaded
        ? checkUniversityEmail(form.elements.collegeEmail, students)
        : studentsLoadError
          ? 'Unable to load student records. Refresh the page and try again.'
          : 'Student records are still loading. Please try again.';

      newErrors.personalEmail = checkPersonalEmail(
        form.elements.personalEmail
      );
    }

    setErrors(newErrors);

    if (
      newErrors.email ||
      newErrors.collegeEmail ||
      newErrors.personalEmail
    ) {
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (mode === 'college') {
      const collegeEmail = values.collegeEmail.trim().toLowerCase();

      setLoginResult({
        role: 'verifiedStudent',
        name: values.name.trim(),
        university: values.university.trim(),
        email: collegeEmail,
        collegeEmail,
        personalEmail: values.personalEmail.trim(),
        semester: values.semester,
      });

      setSubmitted([
        ['Name', values.name.trim()],
        ['University', values.university.trim()],
        ['University email', collegeEmail],
        ['Personal email', values.personalEmail.trim()],
        ['Semester', values.semester],
      ]);
    } else {
      setLoginResult({
        role: 'reader',
        name: values.name.trim(),
        email: values.email.trim(),
      });

      setSubmitted([
        ['Name', values.name.trim()],
        ['Email', values.email.trim()],
      ]);
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setSubmitted(null);
    setLoginResult(null);
  };

  return (
    <main className="uu-login-page">
      <div className="wrapper">
        <header className="brand">
          <h1 className="wordmark" aria-label="UNFILTERED U">
            <span aria-hidden="true">U</span>
            <span className="script" aria-hidden="true">
              nfiltered
            </span>
            <span aria-hidden="true">U</span>
          </h1>

          <p className="tag">Because You Deserve Truth.</p>
        </header>

        <section className="card" aria-labelledby="title">
          {submitted ? (
            <div className="done">
              <div className="tick" aria-hidden="true">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </div>

              <h2 id="title">You’re in.</h2>
              <p>Welcome to UNFILTERED U.</p>

              <dl>
                {submitted.map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>

              {onContinue && (
                <button
                  type="button"
                  className="submit uu-login-continue"
                  onClick={() => onContinue(loginResult)}
                >
                  Continue to website
                </button>
              )}

              <button
                type="button"
                className="again"
                onClick={reset}
              >
                Start over
              </button>
            </div>
          ) : (
            <>
              <h2 id="title">Get started</h2>

              <p className="sub">
                Tell us who you are so we can set things up for you.
              </p>

              <div
                className="toggle"
                data-mode={mode}
                role="radiogroup"
                aria-label="I am a"
              >
                <span className="thumb" aria-hidden="true" />

                <button
                  type="button"
                  role="radio"
                  aria-checked={mode === 'new'}
                  onClick={() => switchMode('new')}
                >
                  New Student
                </button>

                <button
                  type="button"
                  role="radio"
                  aria-checked={mode === 'college'}
                  onClick={() => switchMode('college')}
                >
                  College Student
                </button>
              </div>

              <form
                onSubmit={onSubmit}
                noValidate
                autoComplete="on"
                key={mode}
              >
                <div className="fields">
                  <div className="field">
                    <label htmlFor="name">Name</label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                      value={values.name}
                      onChange={set('name')}
                    />
                  </div>

                  {mode === 'new' && (
                    <div
                      className={`field${errors.email ? ' invalid' : ''}`}
                    >
                      <label htmlFor="email">Email</label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        required
                        value={values.email}
                        onChange={setEmail('email', checkNormalEmail)}
                        onBlur={(e) => {
                          if (e.target.value !== '') {
                            setErrors({
                              ...errors,
                              email: checkNormalEmail(e.target),
                            });
                          }
                        }}
                      />

                      {errors.email && (
                        <p className="err" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  )}

                  {mode === 'college' && (
                    <>
                      <div className="field">
                        <label htmlFor="university">
                          University name
                        </label>

                        <input
                          id="university"
                          name="university"
                          type="text"
                          autoComplete="organization"
                          placeholder="Your university"
                          required
                          value={values.university}
                          onChange={set('university')}
                        />
                      </div>

                      <div
                        className={`field${
                          errors.collegeEmail ? ' invalid' : ''
                        }`}
                      >
                        <label htmlFor="collegeEmail">
                          University email
                        </label>

                        <input
                          id="collegeEmail"
                          name="collegeEmail"
                          type="email"
                          inputMode="email"
                          autoComplete="off"
                          spellCheck="false"
                          placeholder="abcd0614.becse25@chitkara.edu.in"
                          required
                          value={values.collegeEmail}
                          onChange={setEmail(
                            'collegeEmail',
                            (input) =>
                              studentsLoaded
                                ? checkUniversityEmail(input, students)
                                : studentsLoadError
                                  ? 'Unable to load student records. Refresh the page and try again.'
                                  : 'Student records are still loading. Please try again.'
                          )}
                          onBlur={(e) => {
                            if (e.target.value !== '') {
                              setErrors({
                                ...errors,
                                collegeEmail: studentsLoaded
                                  ? checkUniversityEmail(e.target, students)
                                  : studentsLoadError
                                    ? 'Unable to load student records. Refresh the page and try again.'
                                    : 'Student records are still loading. Please try again.',
                              });
                            }
                          }}
                        />

                        {errors.collegeEmail && (
                          <p className="err" role="alert">
                            {errors.collegeEmail}
                          </p>
                        )}
                      </div>

                      <div
                        className={`field${
                          errors.personalEmail ? ' invalid' : ''
                        }`}
                      >
                        <label htmlFor="personalEmail">
                          Personal email
                        </label>

                        <input
                          id="personalEmail"
                          name="personalEmail"
                          type="email"
                          autoComplete="email"
                          inputMode="email"
                          placeholder="you@example.com"
                          required
                          value={values.personalEmail}
                          onChange={setEmail(
                            'personalEmail',
                            checkPersonalEmail
                          )}
                          onBlur={(e) => {
                            if (e.target.value !== '') {
                              setErrors({
                                ...errors,
                                personalEmail: checkPersonalEmail(e.target),
                              });
                            }
                          }}
                        />

                        {errors.personalEmail && (
                          <p className="err" role="alert">
                            {errors.personalEmail}
                          </p>
                        )}
                      </div>

                      <div className="field">
                        <label htmlFor="semester">Semester</label>

                        <select
                          id="semester"
                          name="semester"
                          required
                          value={values.semester}
                          onChange={set('semester')}
                        >
                          <option value="" disabled>
                            Select semester
                          </option>

                          {SEMESTERS.map((semester) => (
                            <option key={semester} value={semester}>
                              Semester {semester}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <button type="submit" className="submit">
                  Continue
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}