-- Attendance options changed in the review dialog:
-- strict ("Very Strict"), tracked ("Asks in class"), friendly ("Friends can sign for you")
alter table public.reviews drop constraint reviews_attendance_check;

-- Existing rows: mandatory maps to strict, optional to friendly
update public.reviews set attendance = 'strict' where attendance = 'mandatory';
update public.reviews set attendance = 'friendly' where attendance = 'optional';

alter table public.reviews
  add constraint reviews_attendance_check
  check (attendance in ('strict', 'tracked', 'friendly'));

comment on column public.reviews.attendance is 'strict | tracked | friendly';
