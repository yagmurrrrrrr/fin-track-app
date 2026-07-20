import { Card, Button, Input, TextArea, Select } from './ui.jsx';

export default function ProfileTab({ t, user, setUser, onSave, onOpenPasswordModal }) {
  const isEmptyProfile = !user.fullName && !user.email && !user.job && !user.address;

  return (
    <Card className="mx-auto max-w-3xl">
      <h2 className="mb-5 text-base font-semibold text-slate-900 dark:text-slate-50">{t.profile}</h2>
      {isEmptyProfile && (
        <p className="mb-5 rounded-xl border border-cyan-200 bg-cyan-50/60 px-4 py-3 text-sm text-cyan-800 dark:border-cyan-500/20 dark:bg-cyan-500/5 dark:text-cyan-300">
          {t.emptyProfileHint}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label={t.fullNameLabel}
          value={user.fullName}
          onChange={e => setUser({ ...user, fullName: e.target.value })}
        />
        <Input
          label={t.emailLabel}
          type="email"
          autoComplete="email"
          value={user.email}
          onChange={e => setUser({ ...user, email: e.target.value })}
        />
        <Input
          label={t.jobLabel}
          value={user.job}
          onChange={e => setUser({ ...user, job: e.target.value })}
        />
        {/* Not: option value'ları ("Kadın"/"Erkek") veritabanında saklanan gerçek değerler —
            backend şemasına dokunmadan sadece görünen metni dile göre çeviriyoruz. */}
        <Select
          label={t.genderLabel}
          value={user.gender}
          onChange={e => setUser({ ...user, gender: e.target.value })}
        >
          <option value="Kadın">{t.female}</option>
          <option value="Erkek">{t.male}</option>
        </Select>
        <div className="sm:col-span-2">
          <TextArea
            label={t.addressLabel}
            value={user.address}
            onChange={e => setUser({ ...user, address: e.target.value })}
            rows={2}
          />
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button className="flex-1" onClick={onSave}>{t.update}</Button>
        <Button variant="outline" className="flex-1" onClick={onOpenPasswordModal}>🔒 {t.changePassword}</Button>
      </div>
    </Card>
  );
}