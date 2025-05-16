import React, { useState, useEffect } from "react";
import qs from "query-string";

import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field } from "formik";
import usePlans from "../../hooks/usePlans";

import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";

import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import logo from "../../assets/logo.png";
import { i18n } from "../../translate/i18n";
import "./style.css";
import { openApi } from "../../services/api";
import toastError from "../../errors/toastError";
import moment from "moment";
const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        PLW
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    background: "linear-gradient(to right,rgb(226, 231, 231) , #26A8AE , #26A8AE)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
    backgroundPosition: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },

  paper: {
    // backgroundColor: theme.palette.login, //DARK MODE PLW DESIGN//
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "55px 30px",
    borderRadius: "12.5px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "80%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    paddingTop: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  submit: {
    "&.MuiButton-root": {
      margin: "20px 0px 16px",
      backgroundColor: "#26A8AE",
      borderRadius: " 30px",
    },
    "&:hover": {
      backgroundColor: "#285ec9",
      // boxShadow: "none",
    },

    backgroundColor: "#26A8AE",
    margin: theme.spacing(3, 0, 2),
    WebkitTextFillColor: "#FFF",
    width: "50%",
  },
  powered: {
    color: "white",
  },
  // input: {
  //   "& .MuiOutlinedInput-root": {
  //     position: "relative",
  //     borderRadius: "30px",
  //   },
  // },
  input: {
    "& .MuiOutlinedInput-root": {
      position: "relative",
      borderRadius: "30px",
      backgroundColor: theme.palette.mode === "dark" ? "#2b2b2b" : "#E8F0FE",
      color: theme.palette.mode === "dark" ? "#fff" : "#000", // <- cor do texto
      "& input": {
        color: theme.palette.mode === "dark" ? "#fff" : "#000", // <- cor do texto digitado
      },
    },
  },

}));

const UserSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  password: Yup.string().min(5, "Too Short!").max(50, "Too Long!"),
  email: Yup.string().email("Invalid email").required("Required"),
});

const SignUp = () => {
  const classes = useStyles();
  const history = useHistory();
  let companyId = null;

  const params = qs.parse(window.location.search);
  if (params.companyId !== undefined) {
    companyId = params.companyId;
  }

  const initialState = {
    name: "",
    email: "",
    phone: "",
    password: "",
    planId: "",
  };

  const [user] = useState(initialState);
  const dueDate = moment().add(3, "day").format();
  const handleSignUp = async (values) => {
    Object.assign(values, { recurrence: "MENSAL" });
    Object.assign(values, { dueDate: dueDate });
    Object.assign(values, { status: "t" });
    Object.assign(values, { campaignsEnabled: true });
    try {
      await openApi.post("/companies/cadastro", values);
      toast.success(i18n.t("signup.toasts.success"));
      history.push("/login");
    } catch (err) {
      console.log(err);
      toastError(err);
    }
  };

  const [plans, setPlans] = useState([]);
  const { getPlanList } = usePlans()

  useEffect(() => {
    const fetchData = async () => {
      const planList = await getPlanList({ listPublic: "false" });

      setPlans(planList);
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="geral">
      <CssBaseline />
      <div className={"container-login"}>
        <div className={"container-img"}>
          <img alt={"Logo"} src={logo} className="img-login"></img>
          <span className="span">
            Comece seu <b>teste GRATUITO</b> de 3 dias do <b>WhappCRM</b> em
            apenas 3 etapas!{" "}<br></br>
            Não se preocupe, nós não pedimos dados do seu cartão. 💳
          </span>
        </div>
        <div className="container-footer">
          <p>
            Copyright ©{" "}
            <a href={"https://totalsig.com.br"} target={"_blank"}>
              Sig Sistemas{""}
            </a>{" "}
            2025{" "}
          </p>
          <p>
            This site is protected by reCAPTCHA Enterprise and the Google{" "}
            <a href={"https://policies.google.com/privacy"} target={"_blank"}>
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href={"https://policies.google.com/terms"} target={"_blank"}>
              Terms of Service
            </a>
          </p>
        </div>
      </div>


      <div className={"container-right"}>
        <div className={"box"}>
          <div className={"container-header-box"}>
            <Link
              // variant="body2"
              // component={RouterLink}
              className={"link-enter"}
              tabIndex={0}
              role={"button"}
              aria-disabled={"false"}
              //to="/signup"
              style={{ textDecoration: "none" }}
            >
              <span className={"label-text"}>⚡ Cadastre-se</span>
            </Link>


          </div>
          <Formik
            initialValues={user}
            enableReinitialize={true}
            validationSchema={UserSchema}
            onSubmit={(values, actions) => {
              setTimeout(() => {
                handleSignUp(values);
                actions.setSubmitting(false);
              }, 400);
            }}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <p>Qual o seu nome?</p>
                    <Field
                      as={TextField}
                      margin="dense"
                      autoComplete="name"
                      name="name"
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                      variant="outlined"
                      fullWidth
                      id="name"
                      label="Seu Nome"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <p>Seu número de Whatsapp</p>
                    <Field
                      as={TextField}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      id="phone"
                      label="Telefone com (DDD)"
                      name="phone"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      autoComplete="phone"
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <p>Seus dados de acesso</p>
                    <Field
                      as={TextField}
                      variant="outlined"
                      margin="dense"
                      fullWidth
                      id="email"
                      label={i18n.t("signup.form.email")}
                      name="email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      autoComplete="email"
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      name="password"
                      error={touched.password && Boolean(errors.password)}
                      helperText={touched.password && errors.password}
                      label={i18n.t("signup.form.password")}
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputLabel htmlFor="plan-selection">Plano</InputLabel>
                    <Field
                      as={Select}
                      margin="dense"
                      variant="outlined"
                      fullWidth
                      id="plan-selection"
                      label="Plano"
                      name="planId"
                      required
                    >
                      {plans.map((plan, key) => (
                        <MenuItem key={key} value={plan.id}>
                          {plan.name} - Atendentes: {plan.users} - WhatsApp:{" "}
                          {plan.connections} - Filas: {plan.queues} - R${" "}
                          {plan.value}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  margin="dense"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  {i18n.t("signup.buttons.submit")}
                </Button>
                <Grid>
                  <Grid item>
                    <Link
                      href="#"
                      variant="body1"
                      component={RouterLink}
                      to="/login"
                      style={{ color: "#3489ff", fontWeight: 500 }}
                    >
                      {i18n.t("signup.buttons.login")}
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>

        </div>
      </div>

    </div>





  );
};
//       <div className={"container-signup"}>

//           <img src={logo} alt="Whats" className="img-logo-signup" />

//           <h4 className="h4">⚡ Cadastre-se</h4>
//           <div>
//             <span className="span">
//               👋🏻 Comece seu <b>teste GRATUITO</b> de 3 dias do WhappCRM em
//               apenas 3 etapas!{" "}
//               <b>Não se preocupe, nós não pedimos dados do seu cartão.</b> 💳
//             </span>
//           </div>
//           </div>
//           </div>


//     		  <Formik
//             initialValues={user}
//             enableReinitialize={true}
//             validationSchema={UserSchema}
//             onSubmit={(values, actions) => {
//               setTimeout(() => {
//                 handleSignUp(values);
//                 actions.setSubmitting(false);
//               }, 400);
//             }}
//           >
//             {({ touched, errors, isSubmitting }) => (
//               <Form className={classes.form}>
//                 <Grid container spacing={2}>
//                   <Grid item xs={12}>
//                     <p>Qual o seu nome?</p>
//                     <Field
//                       as={TextField}
//                       margin="dense"
//                       autoComplete="name"
//                       name="name"
//                       error={touched.name && Boolean(errors.name)}
//                       helperText={touched.name && errors.name}
//                       variant="outlined"
//                       fullWidth
//                       id="name"
//                       label="Seu Nome"
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <p>Seu número de Whatsapp</p>
//                     <Field
//                       as={TextField}
//                       margin="dense"
//                       variant="outlined"
//                       fullWidth
//                       id="phone"
//                       label="Telefone com (DDD)"
//                       name="phone"
//                       error={touched.email && Boolean(errors.email)}
//                       helperText={touched.email && errors.email}
//                       autoComplete="phone"
//                       required
//                     />
//                   </Grid>

//                   <Grid item xs={12}>
//                     <p>Seus dados de acesso</p>
//                     <Field
//                       as={TextField}
//                       variant="outlined"
//                       margin="dense"
//                       fullWidth
//                       id="email"
//                       label={i18n.t("signup.form.email")}
//                       name="email"
//                       error={touched.email && Boolean(errors.email)}
//                       helperText={touched.email && errors.email}
//                       autoComplete="email"
//                       required
//                     />
//                   </Grid>

//                   <Grid item xs={12}>
//                     <Field
//                       as={TextField}
//                       margin="dense"
//                       variant="outlined"
//                       fullWidth
//                       name="password"
//                       error={touched.password && Boolean(errors.password)}
//                       helperText={touched.password && errors.password}
//                       label={i18n.t("signup.form.password")}
//                       type="password"
//                       id="password"
//                       autoComplete="current-password"
//                       required
//                     />
//                   </Grid>
//                   <Grid item xs={12}>
//                     <InputLabel htmlFor="plan-selection">Plano</InputLabel>
//                     <Field
//                       as={Select}
//                       margin="dense"
//                       variant="outlined"
//                       fullWidth
//                       id="plan-selection"
//                       label="Plano"
//                       name="planId"
//                       required
//                     >
//                       {plans.map((plan, key) => (
//                         <MenuItem key={key} value={plan.id}>
//                           {plan.name} - Atendentes: {plan.users} - WhatsApp:{" "}
//                           {plan.connections} - Filas: {plan.queues} - R${" "}
//                           {plan.value}
//                         </MenuItem>
//                       ))}
//                     </Field>
//                   </Grid>
//                 </Grid>
//                 <Button
//                   type="submit"
//                   margin="dense"
//                   fullWidth
//                   variant="contained"
//                   color="primary"
//                   className={classes.submit}
//                 >
//                   {i18n.t("signup.buttons.submit")}
//                 </Button>
//                 <Grid>
//                   <Grid item>
//                     <Link
//                       href="#"
//                       variant="body1"
//                       component={RouterLink}
//                       to="/login"
//                       style={{ color: "#3489ff", fontWeight: 500 }}
//                     >
//                       {i18n.t("signup.buttons.login")}
//                     </Link>
//                   </Grid>
//                 </Grid>
//               </Form>
//             )}
//           </Formik>

//         <div className="footer">
//         <p>
//             Copyright ©{" "}
//             <a href={"https://totalsig.com.br"} target={"_blank"}>
//               Sig Sistemas{""}
//             </a>{" "}
//             2025{" "}
//           </p>
//           <p className="p">
//             This site is protected by reCAPTCHA Enterprise and the Google{" "}
//             <a href={"https://policies.google.com/privacy"} target={"_blank"}>
//               Privacy Policy
//             </a>{" "}
//             and{" "}
//             <a href={"https://policies.google.com/terms"} target={"_blank"}>
//               Terms of Service
//             </a>
//           </p>
//         </div>
//         <Box mt={5}>{/* <Copyright /> */}</Box>
//       </div>
//       <div className={"container-img-signup"}>
//         <div className="img-signup"></div>
//       </div>
//     </div>
//   );
// };

export default SignUp;
