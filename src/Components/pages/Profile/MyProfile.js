import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import PageHeader from "../../ui/PageHeader";
import { Button } from "../../ui/Button";
import {
  PencilIcon,
  PlusIcon,
  BuildingIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  InboxIcon,
} from "../../ui/Icons";
import axiosInstance, { errorMessage } from "../../../config/AxiosInstance";

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3.5">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-bg text-muted">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <dt className="text-[12px] font-medium uppercase tracking-wide text-faint">
          {label}
        </dt>
        <dd className="mt-0.5 break-words text-sm text-fg">
          {value || <span className="text-faint">Not set</span>}
        </dd>
      </div>
    </div>
  );
}

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axiosInstance.get("/my-profile");
        if (cancelled) return;
        setProfile(res.data?.profile?.[0] || null);
      } catch (error) {
        if (!cancelled) {
          toast.error(
            errorMessage(error, "Could not load the company profile")
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const editTarget = `/profileform/${profile?._id || "new"}`;

  return (
    <>
      <PageHeader
        title="Company"
        description="These details are printed on every invoice you generate."
        actions={
          !loading && (
            <Button
              to={editTarget}
              icon={profile ? PencilIcon : PlusIcon}
              variant={profile ? "secondary" : "primary"}
            >
              {profile ? "Edit details" : "Add details"}
            </Button>
          )
        }
      />

      {loading ? (
        <div className="card space-y-4 p-6">
          <div className="skeleton h-7 w-52" />
          <div className="skeleton h-4 w-72" />
          <div className="skeleton h-32 w-full" />
        </div>
      ) : !profile ? (
        <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-elevated text-faint">
            <InboxIcon size={22} />
          </span>
          <div>
            <p className="font-medium text-fg">No company details yet</p>
            <p className="mt-1 max-w-sm text-[13px] text-muted">
              Add your business name, address and GST contact so invoices print
              with the right letterhead.
            </p>
          </div>
          <Button to="/profileform/new" size="sm" icon={PlusIcon}>
            Add details
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <section className="card p-6 lg:col-span-1">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-fg">
              <BuildingIcon size={26} />
            </span>
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-fg">
              {profile.companyname || "Unnamed company"}
            </h2>
            {profile.cemail && (
              <p className="mt-1 break-words text-sm text-muted">
                {profile.cemail}
              </p>
            )}
            <Button
              to={editTarget}
              variant="secondary"
              size="sm"
              icon={PencilIcon}
              className="mt-5 w-full"
            >
              Edit details
            </Button>
          </section>

          <section className="card p-6 lg:col-span-2">
            <h3 className="text-base font-semibold tracking-tight text-fg">
              Details
            </h3>
            <dl className="mt-2 divide-y divide-line">
              <DetailRow
                icon={MapPinIcon}
                label="Address"
                value={profile.address}
              />
              <DetailRow
                icon={MapPinIcon}
                label="City / State"
                value={[profile.city, profile.state].filter(Boolean).join(", ")}
              />
              <DetailRow
                icon={MapPinIcon}
                label="PIN code"
                value={profile.pinno}
              />
              <DetailRow icon={PhoneIcon} label="Phone" value={profile.phone} />
              <DetailRow icon={MailIcon} label="Email" value={profile.cemail} />
            </dl>
          </section>
        </div>
      )}
    </>
  );
}

export default MyProfile;
