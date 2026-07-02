import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { useRef, useState } from "react";
import type { IUserRegister } from "@/commons/types";
import AuthService from "@/services/auth-service";
import { Toast } from "primereact/toast";

// Regex idêntica à do backend: min 1 minúscula, 1 maiúscula, 1 número
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/;

export const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserRegister>({
    defaultValues: { username: "", password: "", displayName: "" },
  });

  const { signup } = AuthService;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const onSubmit = async (data: IUserRegister) => {
    setLoading(true);
    try {
      const response = await signup(data);
      if (response.status === 200) {
        toast.current?.show({
          severity: "success",
          summary: "Conta criada!",
          detail: "Usuário cadastrado com sucesso. Redirecionando para o login...",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        // Exibe a mensagem real do backend (campo específico que falhou)
        toast.current?.show({
          severity: "error",
          summary: "Falha no cadastro",
          detail: response.message || "Verifique os dados e tente novamente.",
          life: 5000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Não foi possível conectar ao servidor.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start px-4" style={{ paddingTop: "100px", minHeight: "100vh", background: "#111827" }}>
      <Toast ref={toast} />
      <Card title="Criar Conta" className="w-full" style={{ maxWidth: "440px" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid space-y-4">

          {/* Nome de Exibição */}
          <div>
            <label className="block mb-2">
              Nome de Exibição
              <span style={{ color: "#6b7280", fontSize: "11px", marginLeft: "6px" }}>mínimo 4 caracteres</span>
            </label>
            <Controller
              name="displayName"
              control={control}
              rules={{
                required: "Campo obrigatório",
                minLength: { value: 4, message: "Mínimo 4 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  className={classNames({ "p-invalid": errors.displayName })}
                  placeholder="Ex: João das Neves"
                />
              )}
            />
            {errors.displayName && (
              <small className="p-error">{errors.displayName.message}</small>
            )}
          </div>

          {/* Usuário */}
          <div>
            <label className="block mb-2">
              Usuário
              <span style={{ color: "#6b7280", fontSize: "11px", marginLeft: "6px" }}>mínimo 4 caracteres</span>
            </label>
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Campo obrigatório",
                minLength: { value: 4, message: "Mínimo 4 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
              }}
              render={({ field }) => (
                <InputText
                  {...field}
                  className={classNames({ "p-invalid": errors.username })}
                  placeholder="Ex: jsnow"
                />
              )}
            />
            {errors.username && (
              <small className="p-error">{errors.username.message}</small>
            )}
          </div>

          {/* Senha */}
          <div>
            <label className="block mb-2">Senha</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Campo obrigatório",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
                pattern: {
                  value: PASSWORD_PATTERN,
                  message: "A senha deve ter pelo menos 1 letra maiúscula, 1 minúscula e 1 número",
                },
              }}
              render={({ field }) => (
                <Password
                  {...field}
                  toggleMask
                  feedback={true}
                  promptLabel="Digite uma senha"
                  weakLabel="Fraca"
                  mediumLabel="Média"
                  strongLabel="Forte"
                  className={classNames({ "p-invalid": errors.password })}
                  inputClassName="w-full"
                  style={{ width: "100%" }}
                />
              )}
            />
            {errors.password && (
              <small className="p-error">{errors.password.message}</small>
            )}
            <small style={{ color: "#6b7280", fontSize: "11px", display: "block", marginTop: "4px" }}>
              Mínimo 6 caracteres — deve conter maiúscula, minúscula e número. Ex: <strong>Senha1</strong>
            </small>
          </div>

          <Button
            type="submit"
            label="Criar Conta"
            icon="pi pi-user-plus"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
            className="w-full mt-3"
          />

          <div className="text-center mt-3">
            <small>
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary">
                Fazer login
              </Link>
            </small>
          </div>

        </form>
      </Card>
    </div>
  );
};
