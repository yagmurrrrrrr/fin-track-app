import { Modal, Button, Input, Select } from './ui.jsx';

export function TransactionModal({ t, open, modalType, formData, setFormData, onSave, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">
        {modalType === 'gelir' ? t.income : t.expense}
      </h3>
      <div className="space-y-3">
        <Input
          label={t.desc}
          value={formData.desc}
          onChange={e => setFormData({ ...formData, desc: e.target.value })}
        />
        <Input
          label={t.amt}
          type="number"
          value={formData.amt}
          onChange={e => setFormData({ ...formData, amt: e.target.value })}
        />
        <Select
          label={t.cat}
          value={formData.cat}
          onChange={e => setFormData({ ...formData, cat: e.target.value })}
        >
          {modalType === 'gelir' ? (
            <>
              <option value="maas">{t.maas}</option>
              <option value="yan_gelir">{t.yan_gelir}</option>
              <option value="prim">{t.prim}</option>
            </>
          ) : (
            <>
              <option value="gida">{t.gida}</option>
              <option value="kira">{t.kira}</option>
              <option value="ulasim">{t.ulasim}</option>
              <option value="teknoloji">{t.teknoloji}</option>
              <option value="eglence">{t.eglence}</option>
              <option value="fatura">{t.fatura}</option>
            </>
          )}
        </Select>
      </div>
      <div className="mt-5 space-y-2">
        <Button className="w-full" onClick={onSave}>{t.save}</Button>
        <button
          onClick={onClose}
          className="block w-full text-center text-sm text-slate-400 hover:underline dark:text-slate-500"
        >
          {t.cancel}
        </button>
      </div>
    </Modal>
  );
}

export function PasswordModal({ t, open, passwordForm, setPasswordForm, onSave, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-50">{t.changePasswordTitle}</h3>
      <div className="space-y-3">
        <Input
          label={t.currentPasswordLabel}
          type="password"
          value={passwordForm.current}
          onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
        />
        <Input
          label={t.newPasswordLabel}
          type="password"
          value={passwordForm.next}
          onChange={e => setPasswordForm({ ...passwordForm, next: e.target.value })}
        />
        <Input
          label={t.confirmNewPasswordLabel}
          type="password"
          value={passwordForm.confirm}
          onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
        />
      </div>
      <div className="mt-5 space-y-2">
        <Button className="w-full" onClick={onSave}>{t.updatePasswordBtn}</Button>
        <button
          onClick={onClose}
          className="block w-full text-center text-sm text-slate-400 hover:underline dark:text-slate-500"
        >
          {t.cancel}
        </button>
      </div>
    </Modal>
  );
}