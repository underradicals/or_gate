import './style.css';

export type Switch = {
  a_switch: number;
  b_switch: number;
  c_switch: number;
}

export const state = {
  a_switch: 0,
  b_switch: 0,
  c_switch: 0
} satisfies Switch;

export const get = (key: keyof Switch) => state[key];
export const set = (key: keyof Switch, value: number) => state[key] = value;

export function select(selector: string): HTMLElement {
  return document.querySelector(selector) as HTMLElement;
}

export const AndSwitchEvent = new CustomEvent('switch');
export const ArrowMoveEvent = new CustomEvent('movearrow');

export const ASwitch = select('.a-switch') as HTMLParagraphElement;
export const BSwitch = select('.b-switch') as HTMLParagraphElement;
export const AGauge = select('.a-gauge') as HTMLElement;
export const BGauge = select('.b-gauge') as HTMLElement;
export const CGauge = select('.c-gauge') as HTMLElement;
export const Bulb = select('.bulb-container svg') as HTMLElement;
export const AMathElement = select('.math-bar p:nth-child(1)') as HTMLElement;
export const BMathElement = select('.math-bar p:nth-child(2)') as HTMLElement;
export const CMathElement = select('.math-bar p:nth-child(4)') as HTMLElement;
export const IconMarker = select('.icon-container') as HTMLElement;
export const InformationIcon = select('.info-icon-container') as HTMLElement;
export const CloseModalButton = select('.close-button') as HTMLElement;



export function HandleOpenModalEvent() {
  const modal = select('dialog') as HTMLDialogElement;
  modal.showModal();
}

export function HandleCloseModalEvent() {
  const modal = select('dialog') as HTMLDialogElement;
  modal.close();
}

export function HandleASwitchClickEvent() {
  AGauge.dispatchEvent(AndSwitchEvent);
  CGauge.dispatchEvent(AndSwitchEvent);
  IconMarker.dispatchEvent(ArrowMoveEvent);
}

export function HandleBSwitchClickEvent() {
  BGauge.dispatchEvent(AndSwitchEvent);
  CGauge.dispatchEvent(AndSwitchEvent);
  IconMarker.dispatchEvent(ArrowMoveEvent);
}

export function HandleAGaugeSwitchEvent() {
  HandleGaugeSwitchEvent(AGauge, 'a_switch', AMathElement);
}

export function HandleBGaugeSwitchEvent() {
  HandleGaugeSwitchEvent(BGauge, 'b_switch', BMathElement);
}


export function HandleGaugeSwitchEvent(gauge: HTMLElement, key: keyof Switch, mathElement: HTMLElement) {
  if (get(key) === 1) {
    set(key, 0);
  } else {
    set(key, 1);
  }


  (mathElement.querySelector('span') as HTMLElement).textContent = `${get(key)}`;
  if (get(key) === 0) {
    shrink(gauge);
  } else {
    grow(gauge);
  }
}

export function HandleCGaugeSwitchEvent() {
  state.c_switch = state.a_switch | state.b_switch;
  (CMathElement.querySelector('span') as HTMLElement).textContent = `${state.c_switch}`;

  if (state.c_switch === 0 && CGauge.classList.contains('grow-delay')) {
    shrink(CGauge);
    fadeout(Bulb);
    return;
  }

  if (state.a_switch === 1 && state.b_switch === 1) {
    grow(CGauge);
    glow(Bulb);
  }

  if (state.a_switch === 1 || state.b_switch === 1) {
    grow(CGauge);
    glow(Bulb);
  }
}

export function HandleIconMarkerMoveEvent() {
  if (state.a_switch === 0 && state.b_switch === 0) {
    moveIcon(0);
    return;
  }

  if (state.a_switch === 1 && state.b_switch === 0) {
    moveIcon(2);
    return;
  }

  if (state.a_switch === 0 && state.b_switch === 1) {
    moveIcon(1);
    return;
  }

  moveIcon(3);
}

export function shrink(element: HTMLElement) {

  if (element === CGauge) {
    CGauge.classList.remove('grow-delay');
    CGauge.classList.add('shrink');
    return;
  }

  element.classList.remove('grow');
  element.classList.add('shrink');
}


export function grow(element: HTMLElement) {

  if (element === CGauge) {
    CGauge.classList.remove('shrink');
    CGauge.classList.add('grow-delay');
    return;
  }

  element.classList.remove('shrink');
  element.classList.add('grow');
}


export function fadeout(element: HTMLElement) {
  element.classList.remove('glow');
  element.classList.add('fadeout');
}

export function glow(element: HTMLElement) {
  element.classList.remove('fadeout');
  element.classList.add('glow');
}

export function moveIcon(value: number) {
  let c = 90 + (value * 52);
  IconMarker.style.transform = `translateY(${c}px) translateX(-15px)`;
}



ASwitch.addEventListener('click', HandleASwitchClickEvent);
BSwitch.addEventListener('click', HandleBSwitchClickEvent);
CGauge.addEventListener('switch', HandleCGaugeSwitchEvent);
AGauge.addEventListener('switch', HandleAGaugeSwitchEvent);
BGauge.addEventListener('switch', HandleBGaugeSwitchEvent);
IconMarker.addEventListener('movearrow', HandleIconMarkerMoveEvent);

InformationIcon.addEventListener('click', HandleOpenModalEvent);
CloseModalButton.addEventListener('click', HandleCloseModalEvent);