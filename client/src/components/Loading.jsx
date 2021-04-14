import React from "react";

function Loading() {
      return (
        <div className="LoadingSolar">
          <main>
            <div className="LoadingSolar__sun"></div>
            <div className="LoadingSolar__mercury-orbit">
              <div className="LoadingSolar__mercury">.</div>
            </div>
            <div className="LoadingSolar__venus-orbit">
              <div className="LoadingSolar__venus">.</div>
            </div>
            <div className="LoadingSolar__earth-orbit">
              <div className="LoadingSolar__earth">.</div>
            </div>
            <div className="LoadingSolar__mars-orbit">
              <div className="LoadingSolar__mars">.</div>
            </div>
          </main>
        </div>
      );
}
export default Loading;