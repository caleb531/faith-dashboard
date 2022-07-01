/* eslint-disable react/no-unescaped-entities */
import LinkButton from '../reusable/LinkButton';
import Modal from '../reusable/Modal';

type Props = {
  onCloseModal: () => void;
};

function AccountAuthFlow({ onCloseModal }: Props) {
  return (
    <Modal onCloseModal={onCloseModal}>
      <section className="account-auth-flow">
        <div className="account-auth-flow-start">
          <h1>Account</h1>
          <p>
            Create a Faith Dashboard account to sync your dashboard and gain
            other features!
          </p>
          <div className="account-auth-flow-cta-container">
            {/* Signing in with a new email address is the same as signing up */}
            <LinkButton href="/sign-up" className="account-auth-flow-cta">
              Sign Up
            </LinkButton>
            <LinkButton href="/sign-in" className="account-auth-flow-cta">
              Sign In
            </LinkButton>
          </div>
        </div>
      </section>
    </Modal>
  );
}

export default AccountAuthFlow;
